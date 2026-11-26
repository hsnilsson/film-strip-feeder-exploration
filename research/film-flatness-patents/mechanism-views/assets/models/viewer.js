import { getModel } from './index.js';
import { makeRenderer } from './renderer.js';

async function start(viewer) {
  const canvas = viewer.querySelector('canvas');
  const form = viewer.querySelector('form');
  const status = viewer.querySelector('.model-state');
  const fallback = viewer.querySelector('.model-alternative');
  const preview = viewer.querySelector('.model-original img');
  const openSheet = viewer.querySelector('.model-original a');
  const openPdf = viewer.querySelector('.model-pdf');
  const { figure, rotation, tilt, zoom } = form.elements;
  let renderer = makeRenderer(canvas);
  if (!renderer) return;

  const model = await getModel(viewer.dataset.patent);
  let active;
  let drag;
  const render = () => renderer.draw(rotation.valueAsNumber, tilt.valueAsNumber, zoom.valueAsNumber/100);
  const reset = () => {
    const [yaw, pitch, scale] = active.camera;
    rotation.value = yaw;
    tilt.value = pitch;
    zoom.value = Math.round(scale*100);
    render();
  };

  function choose(index) {
    const option = figure.options[index];
    figure.selectedIndex = index;
    active = model.figures[index];
    renderer.mesh(model.build(active.state), active.camera[3]);
    canvas.setAttribute('aria-label', model.title + ', ' + option.textContent);
    status.textContent = active.caption;
    if (preview.getAttribute('src') !== option.dataset.image) preview.src = option.dataset.image;
    preview.alt = 'Original patent drawing sheet containing ' + option.textContent;
    openSheet.href = option.dataset.image;
    openPdf.href = option.dataset.pdf;
    openPdf.textContent = 'Open original PDF, page ' + active.page;
    reset();
  }

  form.addEventListener('input', (event) => {
    if (event.target === figure) choose(figure.selectedIndex);
    else render();
  });
  form.querySelector('.model-reset').addEventListener('click', reset);
  viewer.querySelectorAll('[data-model-view]').forEach((button) => {
    button.addEventListener('click', () => {
      choose(Number(button.dataset.modelView));
      figure.focus({ preventScroll: true });
      viewer.scrollIntoView({ block: 'start' });
    });
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const yaw = rotation.valueAsNumber + (event.clientX - drag.x) * .8;
    rotation.value = ((yaw + 180) % 360 + 360) % 360 - 180;
    tilt.value = tilt.valueAsNumber + (event.clientY - drag.y) * .65;
    drag.x = event.clientX;
    drag.y = event.clientY;
    render();
  });
  canvas.addEventListener('lostpointercapture', () => { drag = undefined; });
  canvas.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) return;
    const unit = event.deltaMode;
    const distance = event.deltaY * (unit === WheelEvent.DOM_DELTA_LINE ? 16 :
      unit === WheelEvent.DOM_DELTA_PAGE ? canvas.clientHeight : 1);
    if (!distance) return;
    event.preventDefault();
    const step = Math.max(1, Math.round(Math.abs(distance) * .12));
    zoom.valueAsNumber -= Math.sign(distance) * step;
    render();
  }, { passive: false });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    viewer.classList.remove('model-ready');
    fallback.hidden = false;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    renderer = makeRenderer(canvas);
    if (!renderer) return;
    viewer.classList.add('model-ready');
    fallback.hidden = true;
    choose(figure.selectedIndex);
  });

  viewer.classList.add('model-ready');
  fallback.hidden = true;
  const requested = Array.from(figure.options).findIndex((option) => '#' + option.value === location.hash);
  choose(requested < 0 ? model.start : requested);
  new ResizeObserver(() => {
    if (viewer.classList.contains('model-ready')) render();
  }).observe(canvas);
}
const viewer = document.querySelector('.patent-model');
if (viewer) start(viewer).catch((error) => console.error(error));
