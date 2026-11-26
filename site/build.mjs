import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, posix as path, resolve, sep } from 'node:path';
import GithubSlugger from 'github-slugger';
import MarkdownIt from 'markdown-it';
import { parseFragment, serialize } from 'parse5';
import { createMechanismViews } from './mechanism-views.mjs';
import { createPatentModels } from './patent-models.mjs';
import { legalStatusLink, statusOptions } from './patent-status.mjs';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
const flatnessDirectory = 'research/film-flatness-patents';
const mechanismDirectory = flatnessDirectory + '/mechanism-views';
const mechanismPage = mechanismDirectory + '/index.md';
const pickupDirectory = 'research/film-pickup-and-separation-patents';
const pickupModelsDirectory = pickupDirectory + '/mechanism-views';
const pickupModelsPage = pickupModelsDirectory + '/index.md';
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
const archiveDefinitions = [
  { directory: flatnessDirectory, title: 'Film-flatness archive', gallery: 'Patent gallery' },
  { directory: pickupDirectory, title: 'Pickup & separation archive', gallery: 'Pickup patent gallery' },
];
const patentPage = (archive, entry) => archive.directory + '/patents/' + entry.id + '.md';
const archives = [];
const archivePages = new Map();
for (const definition of archiveDefinitions) {
  const { directory, gallery } = definition;
  const catalogFile = directory + '/catalog.json';
  if (!await exists(resolve(root, catalogFile))) continue;
  const catalog = JSON.parse(await read(catalogFile));
  catalog.patents.sort((a, b) => a.publication.localeCompare(b.publication));
  const nav = [
    [gallery, directory + '/index.md'],
    ['History', directory + '/history.md'],
    ['Mechanisms', directory + '/mechanisms.md'],
    ['Mechanism views', directory === flatnessDirectory ? mechanismPage : pickupModelsPage],
    ['Research method', directory + '/methodology.md'],
  ];
  const archive = { ...definition, catalogFile, catalog, nav };
  archives.push(archive);
  for (const [, file] of nav) archivePages.set(file, archive);
  for (const entry of catalog.patents) archivePages.set(patentPage(archive, entry), archive);
}
const productTrace = 'research/film-flatness-product-trace.md';
const pages = [...projectNav.map(([, file]) => file), ...archivePages.keys(), productTrace];
const outputs = new Map();
for (const file of pages) {
  if (await exists(resolve(root, file))) {
    outputs.set(file, file === 'README.md' ? 'index.html' : file.replace(/\.md$/, '.html'));
  }
}

function href(from, to) {
  return escape(path.relative(path.dirname(outputs.get(from)), outputs.get(to) ?? to));
}

const flatnessArchive = archives.find(({ directory }) => directory === flatnessDirectory);
const pickupArchive = archives.find(({ directory }) => directory === pickupDirectory);
const mechanics = outputs.has(mechanismPage) ? await createMechanismViews({
  root, archive: flatnessDirectory, directory: mechanismDirectory, patents: flatnessArchive.catalog.patents, href, escape,
}) : null;
const pickupModels = outputs.has(pickupModelsPage) ? await createPatentModels({
  root, archive: pickupDirectory, directory: pickupModelsDirectory, patents: pickupArchive.catalog.patents, href, escape,
  registry: await import('../research/film-pickup-and-separation-patents/mechanism-views/assets/models/index.js'),
}) : null;

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

function renderMarkdown(file, source, patent) {
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
    if (patent?.legalStatus && node.tagName === 'a' && text(node).startsWith(patent.id + ' · complete original PDF')) {
      const parent = node.parentNode;
      const status = parseFragment(' · ' + legalStatusLink(patent)).childNodes;
      for (const child of status) child.parentNode = parent;
      parent.childNodes.splice(parent.childNodes.indexOf(node) + 1, 0, ...status);
    }
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
  return '<div class="filter"><label for="filter-' + id + '">' + label + '</label>' +
    '<select id="filter-' + id + '" name="' + id + '"><option value="">All</option>' +
    options.map(([value, name]) => '<option value="' + escape(value) + '">' + escape(name) + '</option>').join('') +
    '</select></div>';
}

function archiveGallery(file, archive) {
  const { directory, catalog: { patents, mechanisms: mechanismLabels } } = archive;
  const distinct = (values) => [...new Set(values)].sort().map((value) => [value, value]);
  const entries = Object.entries(mechanismLabels);
  const statuses = new Set(patents.map((patent) => patent.legalStatus?.status));
  const years = patents.map((patent) => Number(patent.publication.slice(0, 4)));
  const yearInput = (name, label) => '<div class="filter"><label for="filter-' + name + '">' + label +
    '</label><input id="filter-' + name + '" type="number" name="' + name +
    '" min="' + Math.min(...years) + '" max="' + Math.max(...years) + '" placeholder="' +
    (name === 'from' ? Math.min(...years) : Math.max(...years)) + '"></div>';
  const cards = patents.map((patent, index) => {
    const { id, title, company, application, publication, mechanisms, summary, figures, inventors, classifications } = patent;
    const [figure] = figures;
    const linkToPatent = href(file, patentPage(archive, patent));
    const image = href(file, directory + '/figures/' + figure.file);
    const description = escape([id, title, company, application, summary, ...inventors, ...classifications,
      patent.problem, patent.sequence, patent.contact, patent.transverse, patent.longitudinal,
      patent.stack, patent.pickup, patent.separation, patent.handoff,
      ...mechanisms.map((key) => mechanismLabels[key])].join(' '));
    return `<article class="patent-card" data-year="${publication.slice(0, 4)}" data-company="${escape(company)}"
      data-application="${escape(application)}" data-mechanisms="${mechanisms.join(' ')}"
      data-status="${escape(patent.legalStatus?.status ?? 'Unknown')}" data-search="${description}">
      <a class="card-image" href="${image}" aria-label="${escape(id + ' · ' + figure.label + ' · open drawing')}">
        <img src="${image}" alt="${escape(figure.description)}" loading="${index < 4 ? 'eager' : 'lazy'}" decoding="async">
      </a>
      <div class="card-content">
        <div class="card-meta">${escape(publication.slice(0, 4) + ' · ' + id)}${patent.legalStatus
          ? ' · ' + legalStatusLink(patent) : ''} · ${escape(figure.label)}</div>
        <h2><a href="${linkToPatent}">${escape(title)}</a></h2>
        <p>${escape(summary)}</p>
        <div class="card-foot">${escape(application)} · ${escape(company)}</div>
      </div>
    </article>`;
  }).join('');
  return `<section id="patent-explorer" aria-label="Explore the archive">
    <div class="explorer-controls" hidden>
      <form class="filters" role="search">
        <div class="filter query"><label for="filter-q">Search the archive</label><input id="filter-q" type="search" name="q" placeholder="Patent, inventor or mechanism"></div>
        <details class="extra-filters" open>
          <summary>Filters</summary>
          <div class="filter-fields">
            ${select('mechanism', 'Mechanism', entries)}
            ${select('application', 'Application', distinct(patents.map((entry) => entry.application)))}
            ${select('company', 'Company', distinct(patents.map((entry) => entry.company)))}
            ${select('status', 'Status', statusOptions.filter((status) => statuses.has(status)).map((status) => [status, status]))}
            ${yearInput('from', 'From year')}${yearInput('to', 'To year')}
          </div>
        </details>
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

function patentNavigation(file, archive, index) {
  const { patents } = archive.catalog;
  const adjacent = [[patents[index - 1], 'Previous'], [patents[index + 1], 'Next']];
  const entries = adjacent.map(([entry, label]) => entry
    ? link(file, patentPage(archive, entry), label + ' · ' + entry.id + ' · ' + entry.title) : '<span></span>');
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

const figureDirectories = archives.map(({ directory }) => directory + '/figures');
const sourceDirectories = archives.map(({ directory }) => directory + '/sources');
const imageDirectories = ['images', 'assets', ...figureDirectories];
if (mechanics || pickupModels) imageDirectories.push(mechanismDirectory + '/assets');
if (pickupModels) imageDirectories.push(pickupModelsDirectory + '/assets');
const imageFiles = new Set((await Promise.all(imageDirectories.map(filesIn))).flat());
const assetVersions = new Map(await Promise.all(['site.js', 'style.css'].map(async (name) => {
  const contents = await readFile(resolve(root, 'site', name));
  return [name, createHash('sha256').update(contents).digest('hex').slice(0, 12)];
})));
await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'site-assets'), { recursive: true });
await Promise.all([
  ...[...imageDirectories, ...sourceDirectories].map(copyDirectory),
  ...['style.css', 'site.js', 'film.svg'].map((file) => cp(resolve(root, 'site', file), resolve(out, 'site-assets', file))),
  cp(resolve(dirname(require.resolve('mermaid/package.json')), 'dist/mermaid.min.js'), resolve(out, 'site-assets/mermaid.min.js')),
  writeFile(resolve(out, '.nojekyll'), ''),
]);
for (const { catalogFile, catalog } of archives) {
  await mkdir(dirname(resolve(out, catalogFile)), { recursive: true });
  await writeFile(resolve(out, catalogFile), JSON.stringify(catalog, null, 2) + '\n');
}

for (const [file, output] of outputs) {
  const archive = archivePages.get(file);
  const archiveHome = archive?.nav[0][1] === file;
  const index = archive?.catalog.patents.findIndex((entry) => patentPage(archive, entry) === file) ?? -1;
  const patent = archive?.catalog.patents[index];
  const { content, headings, title, mermaid } = renderMarkdown(file, await read(file), patent);
  const viewsForArchive = archive === flatnessArchive ? mechanics : archive === pickupArchive ? pickupModels : null;
  const views = patent ? viewsForArchive?.render(file, patent) : undefined;
  let pageContent = content;
  if (views) {
    const publication = headings.findIndex(([id]) => id === 'publication');
    const sections = archive === flatnessArchive ? [['mechanism-views', 'Read the mechanism']] : [];
    sections.push(['patent-model', 'Explore in 3D']);
    headings.splice(publication < 0 ? headings.length : publication, 0, ...sections);
    pageContent = publication < 0 ? content + views : content.replace('<h2 id="publication">', (heading) => views + '\n' + heading);
  }
  const toc = headings.length > 0 ? '<nav class="toc" aria-label="On this page"><h2>On this page</h2>' +
    headings.map(([id, label]) => '<a href="#' + escape(id) + '">' + escape(label) + '</a>').join('') + '</nav>' : '';
  const asset = (name) => href(file, 'site-assets/' + name) +
    (assetVersions.has(name) ? '?v=' + assetVersions.get(name) : '');
  const research = archives.map(({ title, nav }) => '<h2>' + escape(title) + '</h2>' + menu(file, nav)).join('');
  const defaultArchive = archives[0]?.nav[0][1];
  const visualResources = viewsForArchive?.resources(file, patent) ?? '';
  const modelIndex = file === mechanismPage || file === pickupModelsPage ? viewsForArchive?.index(file) : '';
  const html = `<!doctype html>
<html lang="${file === productTrace ? 'sv' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#1d2d26">
  <title>${escape(title)} · Film Strip Feeder Exploration</title>
  <link rel="icon" href="${asset('film.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset('style.css')}">
  ${mermaid ? '<script defer src="' + asset('mermaid.min.js') + '"></script>' : ''}
  <script defer src="${asset('site.js')}"></script>${visualResources}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="masthead">
    <div class="masthead-inner">
      <a class="brand" href="${href(file, 'README.md')}"><span class="film-icon" aria-hidden="true"></span> Film Strip Feeder Exploration</a>
      <div class="header-links">${defaultArchive ? link(file, defaultArchive, 'Patent archive') : ''}<a href="${repository}">GitHub</a></div>
    </div>
  </header>
  <div class="site-layout${archiveHome ? ' wide' : ''}">
    <aside class="sidebar">
      <details class="navigation" open>
        <summary>Contents</summary>
        <nav aria-label="Project and research">
          <h2>Project</h2>${menu(file, projectNav)}
          ${research}
        </nav>
      </details>
    </aside>
    <main id="main">${pageContent}
      ${archiveHome ? archiveGallery(file, archive) : ''}
      ${modelIndex ?? ''}
      ${index >= 0 ? patentNavigation(file, archive, index) : ''}
      <footer class="page-footer"><a href="${sourceLink(file)}">View source on GitHub</a></footer>
    </main>
    ${archiveHome ? '' : toc}
  </div>
  <dialog class="image-viewer" aria-label="Image preview">
    <div class="image-viewer-actions">
      <a target="_blank" rel="noopener">Open original</a>
      <form method="dialog"><button autofocus>Close</button></form>
    </div>
    <img alt="">
  </dialog>
</body>
</html>`;
  await mkdir(dirname(resolve(out, output)), { recursive: true });
  await writeFile(resolve(out, output), html);
}
if (mechanics) {
  const formerExperiment = resolve(out, flatnessDirectory, 'experiment');
  await mkdir(formerExperiment, { recursive: true });
  await writeFile(resolve(formerExperiment, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=../mechanism-views/"><title>Mechanism views</title></head><body><a href="../mechanism-views/">Open the mechanism views</a></body></html>\n');
}
const patentCount = archives.reduce((total, archive) => total + archive.catalog.patents.length, 0);
const figureCount = (mechanics?.count ?? 0) + (pickupModels?.count ?? 0);
const modelCount = figureCount ? ' with ' + figureCount + ' figure views' : '';
console.log('Built ' + outputs.size + ' documentation pages and ' + patentCount + ' patent records' + modelCount + '.');
