import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, posix as path, resolve, sep } from 'node:path';
import GithubSlugger from 'github-slugger';
import MarkdownIt from 'markdown-it';
import { parseFragment, serialize } from 'parse5';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
const archive = 'research/film-flatness-patents';
const repository = 'https://github.com/hsnilsson/film-strip-feeder-exploration';
const markdown = new MarkdownIt({ html: true });
const exists = async (file) => stat(file).then(() => true, () => false);
const read = (file) => readFile(resolve(root, file), 'utf8');
const require = createRequire(import.meta.url);
const escape = markdown.utils.escapeHtml;
const local = (url) => url && !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url);
const sourceLink = (file) => repository + '/blob/main/' + file;

const projectNav = [
  ['Overview', 'README.md'],
  ['Film stack', 'docs/1-film-stack.md'],
  ['Pickup & separation', 'docs/2-pickup-and-separation.md'],
  ['Transport', 'docs/3-transport.md'],
  ['Flattening & capture', 'docs/4-flattening-and-capture.md'],
  ['Output', 'docs/5-output.md'],
  ['Sensors & control', 'docs/sensors-and-control.md'],
  ['Independent projects', 'INDEPENDENT_PROJECTS.md'],
];
const researchNav = [
  ['Patent gallery', archive + '/index.md'],
  ['History', archive + '/history.md'],
  ['Mechanisms', archive + '/mechanisms.md'],
  ['Research method', archive + '/methodology.md'],
];
const catalogFile = archive + '/catalog.json';
const catalog = await exists(resolve(root, catalogFile))
  ? JSON.parse(await read(catalogFile))
  : { patents: [], mechanisms: {} };
const patents = catalog.patents.sort((a, b) => a.publication.localeCompare(b.publication));
const patentPage = (entry) => archive + '/patents/' + entry.id + '.md';
const pages = [...projectNav, ...researchNav].map(([, file]) => file);
pages.push(...patents.map(patentPage));
const outputs = new Map();
for (const file of pages) {
  if (await exists(resolve(root, file))) {
    outputs.set(file, file === 'README.md' ? 'index.html' : file.replace(/\.md$/, '.html'));
  }
}

function href(from, to) {
  return escape(path.relative(path.dirname(outputs.get(from)), outputs.get(to) ?? to));
}

function link(from, to, label) {
  const active = from === to ? ' aria-current="page"' : '';
  return '<a href="' + href(from, to) + '"' + active + '>' + escape(label) + '</a>';
}

function menu(file, group) {
  return group.filter(([, marked]) => outputs.has(marked))
    .map(([label, target]) => link(file, target, label)).join('');
}

function walk(node, callback) {
  callback(node);
  for (const child of [...(node.childNodes ?? [])]) walk(child, callback);
}

function attribute(node, name) {
  return node.attrs?.find((attr) => attr.name === name);
}

function text(node) {
  return node.value ?? (node.childNodes ?? []).map(text).join('');
}

function renderMarkdown(file, source) {
  const slugger = new GithubSlugger();
  const tree = parseFragment(markdown.render(source));
  const headings = [];
  const images = [];
  let title = file;
  let mermaid = false;
  walk(tree, (node) => {
    if (/^h[1-6]$/.test(node.tagName ?? '')) {
      const label = text(node);
      const id = slugger.slug(label);
      node.attrs.push({ name: 'id', value: id });
      if (node.tagName === 'h1') title = label;
      if (node.tagName === 'h2') headings.push([id, label]);
    }
    for (const name of ['src', 'href']) {
      const attr = attribute(node, name);
      if (!local(attr?.value)) continue;
      const [, destination, suffix] = attr.value.match(/^([^?#]*)(.*)$/);
      const target = path.normalize(path.join(path.dirname(file), destination));
      if (outputs.has(target)) {
        const mapped = outputs.get(target);
        attr.value = path.relative(path.dirname(outputs.get(file)), mapped) + suffix;
      }
    }
    if (node.tagName === 'img') images.push(node);
    if (node.tagName === 'code' && attribute(node, 'class')?.value === 'language-mermaid') mermaid = true;
  });
  for (const image of images) {
    image.attrs.push({ name: 'loading', value: 'lazy' }, { name: 'decoding', value: 'async' });
    const src = attribute(image, 'src')?.value;
    let parent = image.parentNode;
    while (parent && parent.tagName !== 'a') parent = parent.parentNode;
    if (!src || parent) continue;
    const full = src.replace(/-preview(?=\.[^./]+$)/, '');
    const target = path.normalize(path.join(path.dirname(file), full));
    const asset = full !== src && imageFiles.has(target) ? full : src;
    const anchor = parseFragment('<a href="' + escape(asset) + '"></a>').childNodes[0];
    anchor.parentNode = image.parentNode;
    anchor.parentNode.childNodes[anchor.parentNode.childNodes.indexOf(image)] = anchor;
    anchor.childNodes.push(image);
    image.parentNode = anchor;
  }
  return { content: serialize(tree), headings, title, mermaid };
}

function select(id, label, options) {
  return '<label>' + label + '<select name="' + id + '"><option value="">All</option>' +
    options.map(([value, name]) => '<option value="' + escape(value) + '">' + escape(name) + '</option>').join('') +
    '</select></label>';
}

function archiveGallery(file) {
  const distinct = (values) => [...new Set(values)].sort().map((value) => [value, value]);
  const entries = Object.entries(catalog.mechanisms);
  const years = patents.map((patent) => Number(patent.publication.slice(0, 4)));
  const yearInput = (name, label) => '<label>' + label + '<input type="number" name="' + name +
    '" min="' + Math.min(...years) + '" max="' + Math.max(...years) + '" placeholder="' +
    (name === 'from' ? Math.min(...years) : Math.max(...years)) + '"></label>';
  const cards = patents.map((patent) => {
    const { id, title, company, application, publication, mechanisms, summary, figures, inventors, keywords } = patent;
    const [figure] = figures;
    const linkToPatent = href(file, patentPage(patent));
    const description = escape([id, title, company, application, summary, ...inventors, ...keywords,
      ...mechanisms.map((key) => catalog.mechanisms[key])].join(' '));
    return `<article class="patent-card" data-year="${publication.slice(0, 4)}" data-company="${escape(company)}"
      data-application="${escape(application)}" data-mechanisms="${mechanisms.join(' ')}" data-search="${description}">
      <a class="card-image" href="${href(file, archive + '/figures/' + figure.file)}" aria-label="${escape(id + ' · ' + figure.label + ' · open drawing')}">
        <img src="${href(file, archive + '/figures/' + figure.file)}" alt="${escape(figure.description)}" loading="lazy" decoding="async">
      </a>
      <div class="card-content">
        <div class="card-meta">${escape(publication.slice(0, 4) + ' · ' + id + ' · ' + figure.label)}</div>
        <h2><a href="${linkToPatent}">${escape(title)}</a></h2>
        <p>${escape(summary)}</p>
        <div class="card-foot">${escape(application)} · ${escape(company)}</div>
      </div>
    </article>`;
  }).join('');
  return `<section id="patent-explorer" aria-label="Explore the archive">
    <div class="explorer-controls" hidden>
      <form class="filters" role="search">
        <label class="query">Search the archive<input type="search" name="q" placeholder="Patent, inventor or mechanism"></label>
        ${select('mechanism', 'Mechanism', entries)}
        ${select('application', 'Application', distinct(patents.map((entry) => entry.application)))}
        ${select('company', 'Company', distinct(patents.map((entry) => entry.company)))}
        ${yearInput('from', 'From year')}${yearInput('to', 'To year')}
      </form>
      <div class="explorer-toolbar">
        <div class="views" role="group" aria-label="Display mode">
          <button type="button" data-view="gallery" aria-pressed="true">Gallery</button>
          <button type="button" data-view="timeline" aria-pressed="false">Timeline</button>
          <button type="button" data-view="mechanism" aria-pressed="false">By mechanism</button>
        </div>
        <p id="result-count" role="status"></p>
        <button type="button" class="clear">Clear filters</button>
      </div>
    </div>
    <div id="patent-results" class="patent-grid">${cards}</div>
  </section>`;
}

function patentNavigation(file, index) {
  const adjacent = [[patents[index - 1], 'Previous'], [patents[index + 1], 'Next']];
  const entries = adjacent.map(([entry, label]) => entry
    ? link(file, patentPage(entry), label + ' · ' + entry.id + ' · ' + entry.title) : '<span></span>');
  return '<nav class="patent-adjacent" aria-label="Adjacent patents">' + entries.join('') + '</nav>';
}

async function copyDirectory(dir) {
  const source = resolve(root, dir);
  if (await exists(source)) await cp(source, resolve(out, dir), { recursive: true });
}

async function filesIn(dir) {
  if (!await exists(resolve(root, dir))) return [];
  const files = await readdir(resolve(root, dir), { recursive: true, withFileTypes: true });
  return files.filter((entry) => entry.isFile())
    .map((entry) => resolve(entry.parentPath, entry.name).slice(root.length + 1).split(sep).join('/'));
}

const imageFiles = new Set(await Promise.all(['images', 'assets', archive + '/figures'].map(filesIn)).then((sets) => sets.flat()));
await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'site-assets'), { recursive: true });
await Promise.all([
  ...['assets', 'images', archive + '/figures', archive + '/sources'].map(copyDirectory),
  ...['style.css', 'site.js'].map((file) => cp(resolve(root, 'site', file), resolve(out, 'site-assets', file))),
  cp(resolve(dirname(require.resolve('mermaid/package.json')), 'dist/mermaid.min.js'), resolve(out, 'site-assets/mermaid.min.js')),
  writeFile(resolve(out, '.nojekyll'), ''),
]);
if (patents.length) {
  await writeFile(resolve(out, catalogFile), JSON.stringify(catalog, null, 2) + '\n');
}

for (const [file, output] of outputs) {
  const { content, headings, title, mermaid } = renderMarkdown(file, await read(file));
  const archiveHome = file === archive + '/index.md';
  const index = patents.findIndex((entry) => patentPage(entry) === file);
  const toc = headings.length > 0 ? '<nav class="toc" aria-label="On this page"><h2>On this page</h2>' +
    headings.map(([id, label]) => '<a href="#' + escape(id) + '">' + escape(label) + '</a>').join('') + '</nav>' : '';
  const asset = (name) => href(file, 'site-assets/' + name);
  const research = menu(file, researchNav);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#1d2d26">
  <title>${escape(title)} · Film Strip Feeder Exploration</title>
  <link rel="stylesheet" href="${asset('style.css')}">
  ${mermaid ? '<script defer src="' + asset('mermaid.min.js') + '"></script>' : ''}
  <script defer src="${asset('site.js')}"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="masthead">
    <div class="masthead-inner">
      <a class="brand" href="${href(file, 'README.md')}"><span class="film-icon" aria-hidden="true"></span> Film Strip Feeder Exploration</a>
      <div class="header-links">${research ? link(file, archive + '/index.md', 'Patent archive') : ''}<a href="${repository}">GitHub</a></div>
    </div>
  </header>
  <div class="site-layout${archiveHome ? ' wide' : ''}">
    <aside class="sidebar">
      <details class="navigation" open>
        <summary>Contents</summary>
        <nav aria-label="Project and research">
          <h2>Project</h2>${menu(file, projectNav)}
          ${research ? '<h2>Film-flatness archive</h2>' + research : ''}
        </nav>
      </details>
    </aside>
    <main id="main">${content}
      ${archiveHome ? archiveGallery(file) : ''}
      ${index >= 0 ? patentNavigation(file, index) : ''}
      <footer class="page-footer"><a href="${sourceLink(file)}">View source on GitHub</a></footer>
    </main>
    ${archiveHome ? '' : toc}
  </div>
</body>
</html>`;
  await mkdir(dirname(resolve(out, output)), { recursive: true });
  await writeFile(resolve(out, output), html);
}
console.log('Built ' + outputs.size + ' documentation pages and ' + patents.length + ' patent records.');
