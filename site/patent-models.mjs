import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import * as flatnessModels from '../research/film-flatness-patents/mechanism-views/assets/models/index.js';

const sharedAssets = 'research/film-flatness-patents/mechanism-views/assets/';

const key = (page, label) => 'model-view-' + page + '-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const labelOf = (label) => label === 'drawing' ? 'Unnumbered drawing' :
  label === 'drawing cover' ? 'Cover drawing' : 'Fig. ' + label.replace(/ cover$/, ' on cover');

export async function createPatentModels({ root, archive, directory, patents, href, escape, registry = flatnessModels }) {
  const { getModel, modelIds } = registry;
  const versions = await Promise.all(['mechanisms.css', 'models/viewer.js'].map(async (name) => {
    const contents = await readFile(resolve(root, sharedAssets, name));
    return '?v=' + createHash('sha256').update(contents).digest('hex').slice(0, 12);
  }));
  let count = 0;
  const records = new Map();
  const suffix = (patent, page) => {
    const original = patent.figures.find((image) => image.page === page);
    if (original) return archive + '/figures/' + original.file;
    return directory + '/assets/model-plates/' + patent.id + '-p' + String(page).padStart(2, '0') + '.webp';
  };
  if (new Set(patents.map((patent) => patent.id)).size !== modelIds.length) {
    throw new Error('The atlas must contain a model for each patent.');
  }
  for (const patent of patents) {
    const model = getModel(patent.id);
    const labelKeys = new Set(model?.figures.map(({ page, label }) => key(page, label)));
    const pages = new Set(model?.figures.map(({ page }) => page));
    if (!model || !labelKeys.size || labelKeys.size !== model.figures.length ||
        patent.figures.some(({ page }) => !pages.has(page))) {
      throw new Error('Missing or repeated source views for ' + patent.id);
    }
    const states = new Set(model.figures.map(({ state }) => state));
    for (const state of states) {
      const faces = model.build(state);
      if (!faces.length || faces.some(({ vertices, fill }) =>
        !/^#[0-9a-f]{6}$/i.test(fill) || vertices.length < 3 ||
        vertices.some((point) => point.length !== 3 || !point.every(Number.isFinite)))) {
        throw new Error('Invalid model geometry for ' + patent.id + ' (' + state + ')');
      }
    }
    for (const page of pages) await stat(resolve(root, suffix(patent, page)));
    records.set(patent.id, model);
    count += model.figures.length;
  }

  function render(from, patent) {
    const model = records.get(patent.id);
    const views = model.figures.map((view) => {
      const { page, label } = view;
      return {
        ...view, id: key(page, label), name: labelOf(label),
        image: href(from, suffix(patent, page)),
        pdf: href(from, archive + '/sources/' + patent.id + '.pdf') + '#page=' + page,
      };
    });
    const first = views[model.start];
    const options = views.map(({ id, name, image, pdf, page }, i) =>
      `<option value="${id}" data-image="${image}" data-pdf="${pdf}"${i === model.start ? ' selected' : ''}>${escape(name)} · PDF p. ${page}</option>`).join('');
    const list = views.map(({ id, name, page, pdf, caption }, i) =>
      `<li id="${id}"><a href="${pdf}">${escape(name)} · PDF p. ${page}</a>
        <button type="button" data-model-view="${i}">Show in 3D</button>
        <p>${escape(caption)}</p></li>`).join('');
    const modelModule = registry === flatnessModels ? '' : ` data-model-module="${href(from, directory + '/assets/models/index.js')}"`;
    return `<section class="patent-model" id="patent-model" data-patent="${escape(patent.id)}"${modelModule} aria-labelledby="patent-model-heading">
      ${patent.id === 'US2824491A' ? '<span id="hoffmaster-model"></span>' : ''}
      <h2 id="patent-model-heading">Explore in 3D</h2>
      <p>Use the figure list to switch between documented configurations and viewpoints. Reconstruction dimensions, unlisted angles and clearances are schematic.</p>
      <p class="model-alternative">The figure guide below pairs each illustration with its PDF page and a description. Interactive rotation requires WebGL.</p>
      <div class="model-interactive">
        <form class="model-controls" aria-label="Patent model controls">
          <label class="model-figure">Patent figure <select name="figure">${options}</select></label>
          <label>Rotation <input name="rotation" type="range" min="-180" max="180" value="33" aria-label="Horizontal rotation"></label>
          <label>Tilt <input name="tilt" type="range" min="-87" max="87" value="49"></label>
          <label>Zoom <input name="zoom" type="range" min="55" max="185" value="100"></label>
          <button type="button" class="model-reset">Reset view</button>
        </form>
        <div class="model-display">
          <div class="model-render">
            <canvas width="800" height="600" role="img" aria-describedby="model-state"></canvas>
            <p id="model-state" class="model-state" role="status">${escape(first.caption)}</p>
            <p class="model-help">Drag to rotate. Scroll over the model to zoom.</p>
            <ul class="model-colors" aria-label="Model colours">
              <li class="color-film">Film</li><li class="color-moving">Moving parts</li>
              <li class="color-spring">Springs and pads</li><li class="color-glass">Glass and air</li>
            </ul>
          </div>
          <figure class="model-original">
            <a href="${first.image}"><img src="${first.image}" loading="lazy" decoding="async" alt="${escape('Original patent plate for ' + first.name)}"></a>
            <figcaption><a class="model-pdf" href="${first.pdf}">Open original PDF, page ${first.page}</a></figcaption>
          </figure>
        </div>
      </div>
      <details class="model-index"><summary>Figure guide · ${views.length} source views</summary><ol>${list}</ol></details>
    </section>`;
  }

  return {
    count,
    render,
    index(from) {
      return '<ol class="mechanism-index">' + patents.map((patent) =>
        `<li><a href="${href(from, archive + '/patents/' + patent.id + '.md')}#patent-model">${escape(patent.title)}</a> <span>${escape(patent.id)}</span></li>`).join('') + '</ol>';
    },
    resources(from, patent) {
      if (!patent && from !== directory + '/index.md') return '';
      const stylesheet = `<link rel="stylesheet" href="${href(from, sharedAssets + 'mechanisms.css')}${versions[0]}">`;
      const script = patent ? `<script type="module" src="${href(from, sharedAssets + 'models/viewer.js')}${versions[1]}"></script>` : '';
      return stylesheet + script;
    },
  };
}
