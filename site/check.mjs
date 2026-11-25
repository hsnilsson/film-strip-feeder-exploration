import { readFile, readdir } from 'node:fs/promises';
import { dirname, posix as path, resolve, sep } from 'node:path';
import { parse } from 'parse5';

const root = resolve(import.meta.dirname, '../dist');
const entries = await readdir(root, { recursive: true, withFileTypes: true });
const files = new Set(entries.filter((entry) => entry.isFile())
  .map((entry) => resolve(entry.parentPath, entry.name).slice(root.length + 1).split(sep).join('/')));
const pages = new Map();
const errors = [];
let checked = 0;

function visit(node, page) {
  for (const { name, value } of node.attrs ?? []) {
    if (name === 'id') page.ids.add(value);
    if (name === 'href' || name === 'src') page.urls.push(value);
  }
  for (const child of node.childNodes ?? []) visit(child, page);
}

for (const file of files) {
  if (!file.endsWith('.html')) continue;
  const page = { ids: new Set(), urls: [] };
  visit(parse(await readFile(resolve(root, file), 'utf8')), page);
  pages.set(file, page);
}

for (const [file, { urls }] of pages) {
  for (const url of urls) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
    const resolved = new URL(url, 'https://example.com/film-strip-feeder-exploration/' + file);
    const pathname = decodeURIComponent(resolved.pathname);
    const target = pathname.startsWith('/film-strip-feeder-exploration/')
      ? pathname.slice('/film-strip-feeder-exploration/'.length) : pathname;
    const link = target.endsWith('/') || !target ? path.join(target, 'index.html') : target;
    checked++;
    if (!files.has(link)) errors.push(file + ' → ' + url + ' (missing file)');
    else if (resolved.hash && pages.has(link) && !pages.get(link).ids.has(decodeURIComponent(resolved.hash.slice(1)))) {
      errors.push(file + ' → ' + url + ' (missing fragment)');
    }
  }
}

if (errors.length) throw new Error(errors.join('\n'));
console.log('Checked ' + checked + ' internal links and assets across ' + pages.size + ' pages.');
