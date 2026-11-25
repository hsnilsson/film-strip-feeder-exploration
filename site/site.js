const mobile = matchMedia('(max-width: 47rem)');
const navigation = document.querySelector('.navigation');
function updateNavigation() {
  navigation.open = !mobile.matches;
}
updateNavigation();
mobile.addEventListener('change', updateNavigation);

const imageViewer = document.querySelector('.image-viewer');
const viewerImage = imageViewer.querySelector('img');
const viewerOriginal = imageViewer.querySelector('a');
document.querySelector('main').addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download') || event.defaultPrevented ||
      event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  const url = new URL(link.href);
  if (!/^https?:$/.test(url.protocol) || !/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) return;

  event.preventDefault();
  viewerImage.alt = link.querySelector('img')?.alt ?? link.textContent.trim();
  viewerImage.src = url.href;
  viewerOriginal.href = url.href;
  imageViewer.showModal();
});
imageViewer.addEventListener('click', (event) => {
  if (event.target === imageViewer) imageViewer.close();
});

const diagrams = document.querySelectorAll('pre:has(> .language-mermaid)');
if (diagrams.length && window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'neutral' });
  diagrams.forEach(async (diagram, index) => {
    try {
      const { svg, bindFunctions } = await window.mermaid.render('diagram-' + index, diagram.textContent);
      diagram.classList.add('mermaid');
      diagram.innerHTML = svg;
      bindFunctions?.(diagram);
    } catch (error) {
      console.error('Unable to render the Mermaid diagram', error);
    }
  });
}

const explorer = document.querySelector('#patent-explorer');
if (explorer) {
  const controls = explorer.querySelector('.explorer-controls');
  const filters = controls.querySelector('form');
  const extraFilters = filters.querySelector('details');
  const results = explorer.querySelector('#patent-results');
  const status = explorer.querySelector('#result-count');
  const views = [...controls.querySelectorAll('[data-view]')];
  const cards = [...results.children];
  let view = 'gallery';

  function updateFilters() {
    extraFilters.open = !mobile.matches;
  }
  updateFilters();
  mobile.addEventListener('change', updateFilters);

  function normalise(value) {
    return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  function render() {
    const { q, mechanism, application, company, from, to } = Object.fromEntries(new FormData(filters));
    const words = normalise(q).trim().split(/\s+/).filter(Boolean);
    const visible = cards.filter(({ dataset }) =>
      (!mechanism || dataset.mechanisms.split(' ').includes(mechanism)) &&
      (!application || dataset.application === application) &&
      (!company || dataset.company === company) &&
      (!from || Number(dataset.year) >= Number(from)) &&
      (!to || Number(dataset.year) <= Number(to)) &&
      words.every((word) => normalise(dataset.search).includes(word)));
    status.textContent = visible.length + ' of ' + cards.length + ' patents';
    results.className = view === 'gallery' ? 'patent-grid' : 'result-groups ' + view;
    results.replaceChildren();
    if (!visible.length) {
      const message = document.createElement('p');
      message.textContent = 'No patents match these filters.';
      results.append(message);
      return;
    }
    if (view === 'gallery') {
      results.append(...visible);
      return;
    }
    const groups = view === 'timeline'
      ? [...new Set(visible.map(({ dataset }) => dataset.year))].map((year) => [
        year, visible.filter(({ dataset }) => dataset.year === year),
      ])
      : [...filters.elements.mechanism.options].slice(1).filter((option) => !mechanism || option.value === mechanism)
        .map(({ value, label }) => [label, visible.filter(({ dataset }) => dataset.mechanisms.split(' ').includes(value))]);
    for (const [label, entries] of groups) {
      if (!entries.length) continue;
      const section = document.createElement('section');
      section.className = 'result-group';
      const heading = document.createElement('h2');
      heading.textContent = label;
      const grid = document.createElement('div');
      grid.className = 'patent-grid';
      grid.append(...entries.map((entry) => entry.cloneNode(true)));
      section.append(heading, grid);
      results.append(section);
    }
  }

  filters.addEventListener('input', render);
  filters.addEventListener('submit', (event) => {
    event.preventDefault();
    render();
  });
  controls.querySelector('.clear').addEventListener('click', () => {
    filters.reset();
    render();
    filters.elements.q.focus();
  });
  for (const button of views) {
    button.addEventListener('click', () => {
      view = button.dataset.view;
      for (const item of views) item.setAttribute('aria-pressed', String(item === button));
      render();
    });
  }
  controls.hidden = false;
  render();
}
