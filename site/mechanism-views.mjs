import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { createPatentModels } from './patent-models.mjs';

export async function createMechanismViews({ root, archive, directory, patents, href, escape }) {
  const assets = directory + '/assets/';
  const [raw, models, versions] = await Promise.all([
    readFile(resolve(root, directory, 'views.json'), 'utf8'),
    createPatentModels({ root, archive, directory, patents, href, escape }),
    Promise.all(['mechanisms.css', 'models/viewer.js'].map(async (name) => {
      const contents = await readFile(resolve(root, assets, name));
      return [name, createHash('sha256').update(contents).digest('hex').slice(0, 12)];
    })).then((entries) => new Map(entries)),
  ]);
  const entries = JSON.parse(raw);
  const figures = new Map();
  const redraws = {
    US5028956A: {
      'Fig. 7A': {
        file: 'kodak-advance.svg',
        alt: 'In the advance position the belt touches the film. The tie bar and cylinder are clear of their clamping surfaces.',
        caption: 'Transverse section redrawn from fig. 7A. The belt runs into the page around the pulleys in fig. 6.',
      },
      'Fig. 7B': {
        file: 'kodak-clamp.svg',
        alt: 'The bell-crank finger flexes the spring arm. The tie bar loads the belt and the far cylinder moves down and outward.',
        caption: 'Transverse section redrawn from fig. 7B. The arrows show the order and direction of the clamp motions.',
      },
    },
    US2824491A: {
      'Figs. 2–3': {
        file: 'hoffmaster-elevation.svg',
        alt: 'Raised and seated end views showing how the bars tilt, spread under the flanges and grip the film.',
        caption: 'End views redrawn from figs. 2 and 3.',
      },
      'Figs. 4–5': {
        file: 'hoffmaster-contact.svg',
        alt: 'Details of the right-hand bar touching the film and then seating beneath the spring lip.',
        caption: 'Right-hand film and flange contacts redrawn from figs. 4 and 5.',
      },
    },
  };

  if (Object.keys(entries).length !== patents.length) {
    throw new Error('Mechanism views must cover each catalog entry.');
  }
  for (const patent of patents) {
    const views = entries[patent.id];
    if (!views?.length) throw new Error('Missing mechanism views for ' + patent.id);
    for (const view of views) {
      const figure = patent.figures.find((item) => item.page === view.page);
      if (!figure) throw new Error('Mechanism view refers to a missing drawing page for ' + patent.id);
      const [left, top, right, bottom] = view.crop;
      if (left < 0 || top < 0 || right > 100 || bottom > 100 || left >= right || top >= bottom ||
          view.marks.some(([x, y]) => x < left || x > right || y < top || y > bottom)) {
        throw new Error('Invalid drawing crop or marker for ' + patent.id);
      }
      if (!figures.has(figure.file)) {
        const png = await readFile(resolve(root, archive, 'figures', figure.file));
        figures.set(figure.file, png.readUInt32BE(20) / png.readUInt32BE(16));
      }
    }
  }

  const asset = (from, name) => href(from, assets + name) + (versions.has(name) ? '?v=' + versions.get(name) : '');
  function annotatedView(from, patent, view) {
    const { file } = patent.figures.find((figure) => figure.page === view.page);
    const drawing = href(from, archive + '/figures/' + file);
    const source = href(from, archive + '/sources/' + patent.id + '.pdf') + '#page=' + view.page;
    const proportion = figures.get(file);
    const [left, top, right, bottom] = view.crop;
    const width = right - left;
    const height = (bottom - top) * proportion;
    const turn = view.turn ?? 0;
    const viewport = turn ? `0 0 ${height} ${width}` : `${left} ${top * proportion} ${width} ${height}`;
    const transform = turn ? `translate(${height} 0) rotate(90) translate(${-left} ${-top * proportion})` : '';
    const radius = Math.min(width, height) * .034;
    const markers = view.marks.map(([x, y], i) =>
      `<g transform="translate(${x} ${y * proportion}) rotate(${-turn})"><circle r="${radius}" /><text font-size="${radius * 1.2}" dy=".35em" text-anchor="middle">${i + 1}</text></g>`).join('');
    const notes = view.marks.map(([, , note]) => '<li>' + escape(note) + '</li>').join('');
    return `<figure class="mechanism-source-view">
      <a class="mechanism-drawing" href="${drawing}" aria-label="${escape('Enlarge original drawing for ' + view.title)}">
        <svg viewBox="${viewport}" role="img" aria-label="${escape(view.title + ' with numbered annotations')}">
          <g transform="${transform}">
            <image href="${drawing}" width="100" height="${100 * proportion}" />
            <g class="drawing-markers" aria-hidden="true">${markers}</g>
          </g>
        </svg>
      </a>
      <figcaption>
        <h3>${escape(view.title)}</h3>
        <a href="${source}">${escape(view.figure)}, PDF page ${view.page}</a>
        <ol>${notes}</ol>
        <p>${escape(view.reading)}</p>
      </figcaption>
    </figure>`;
  }

  return {
    count: models.count,
    render(from, patent) {
      const views = entries[patent.id].map((view) => {
        const original = annotatedView(from, patent, view);
        const redraw = redraws[patent.id]?.[view.figure];
        if (!redraw) return original;
        const drawing = asset(from, redraw.file);
        return `<div class="mechanism-comparison">${original}
          <figure><a href="${drawing}"><img src="${drawing}" alt="${escape(redraw.alt)}"></a><figcaption>${escape(redraw.caption)}</figcaption></figure></div>`;
      }).join('');
      return `<section class="mechanism-views" aria-labelledby="mechanism-views">
        <h2 id="mechanism-views">Read the mechanism</h2>
        <div class="mechanism-view-list">${views}</div>
      </section>${models.render(from, patent)}`;
    },
    index(from) {
      return '<ol class="mechanism-index">' + patents.map((patent) =>
        `<li><a href="${href(from, archive + '/patents/' + patent.id + '.md')}#patent-model">${escape(patent.title)}</a> <span>${escape(patent.id)}</span></li>`).join('') + '</ol>';
    },
    resources(from, patent) {
      if (!patent && from !== directory + '/index.md') return '';
      const stylesheet = '<link rel="stylesheet" href="' + asset(from, 'mechanisms.css') + '">';
      const script = patent ? '<script type="module" src="' + asset(from, 'models/viewer.js') + '"></script>' : '';
      return stylesheet + script;
    },
  };
}
