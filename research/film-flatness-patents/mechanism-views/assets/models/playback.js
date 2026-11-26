export function setupPlayback(viewer, model, { showFigure, showFrame, setCamera }) {
  const panel = viewer.querySelector('.model-playback');
  if (!panel || !model.playback) return;

  const cycle = model.playback;
  const { stages, duration } = cycle;
  const sources = stages.map(({ figure }) => model.figures.findIndex(({ label }) => label === figure));
  const toggle = panel.querySelector('.playback-toggle');
  const position = panel.querySelector('.playback-position');
  const buttons = [...panel.querySelectorAll('[data-playback-stage]')];
  let stage = -1;
  let elapsed = 0;
  let request = null;

  function seek(time) {
    if (stage < 0) setCamera(cycle.camera);
    elapsed = time;
    position.valueAsNumber = time;
    const index = stages.findLastIndex(({ time: start }) => time >= start);
    if (index !== stage) {
      stage = index;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === stage)));
      position.setAttribute('aria-valuetext', stages[stage].title);
      showFigure(sources[stage], stages[stage].caption);
    }
    showFrame(cycle.frame(time), cycle.focus);
  }

  function pause() {
    if (request !== null) cancelAnimationFrame(request);
    request = null;
    toggle.textContent = elapsed >= duration ? 'Replay pickup cycle' :
      stage < 0 || elapsed === 0 ? 'Play pickup cycle' : 'Resume pickup cycle';
  }

  function play() {
    if (stage < 0 || elapsed >= duration) seek(0);
    const origin = performance.now() - elapsed * 1000;
    let lastFrame = -Infinity;
    toggle.textContent = 'Pause pickup cycle';
    function tick(now) {
      const time = Math.min(duration, Math.max(elapsed, (now - origin) / 1000));
      if (now - lastFrame >= 1000 / 30 || time >= duration) {
        seek(time);
        lastFrame = now;
      }
      if (time >= duration) pause();
      else request = requestAnimationFrame(tick);
    }
    request = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => {
    if (request === null) play();
    else pause();
  });
  position.addEventListener('input', () => {
    seek(position.valueAsNumber);
    pause();
  });
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    seek(stages[i].time);
    pause();
  }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  panel.hidden = false;

  return {
    get camera() { return stage < 0 ? undefined : cycle.camera; },
    clear() {
      stage = -1;
      elapsed = 0;
      position.valueAsNumber = 0;
      position.removeAttribute('aria-valuetext');
      buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
      pause();
    },
  };
}
