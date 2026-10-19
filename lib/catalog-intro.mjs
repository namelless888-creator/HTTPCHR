/** Scrub the pinned catalog introduction and reveal its ingredient labels.
 * Keep this function self-contained so standalone HTML can embed its source.
 * @param {HTMLVideoElement | null} video
 */
export function mountCatalogIntro(video) {
  if (!video) return () => {};
  const root = video.closest('.catalog-intro');
  const stage = root?.querySelector('.catalog-intro-stage');
  if (!root || !stage) return () => {};
  const header = document.querySelector('.main-header');
  const hint = root.querySelector('.catalog-intro-hint');
  const ranges = [[.58, .68], [.70, .80], [.82, .92]];
  const callouts = [...root.querySelectorAll('.catalog-callout')].map((element, index) => {
    const fallback = ranges[Math.min(index, ranges.length - 1)];
    const start = Number.parseFloat(element.dataset.revealStart);
    const end = Number.parseFloat(element.dataset.revealEnd);
    return {
      element,
      start: Number.isFinite(start) ? start : fallback[0],
      end: Number.isFinite(end) ? end : fallback[1],
    };
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  let disposed = false;
  let frame = 0;
  let lastTick = 0;
  let geometryDirty = true;
  let measuredHeader = 0;
  video.muted = true;
  video.playsInline = true;
  video.loop = false;
  video.autoplay = false;
  video.pause();

  const drawArrows = () => {
    const bounds = stage.getBoundingClientRect();
    const sourceWidth = video.videoWidth || 1280;
    const sourceHeight = video.videoHeight || 736;
    const scale = Math.max(bounds.width / sourceWidth, bounds.height / sourceHeight);
    const position = getComputedStyle(video).objectPosition.split(/\s+/);
    const offsetX = (bounds.width - sourceWidth * scale) * (Number.parseFloat(position[0]) / 100 || .5);
    const offsetY = (bounds.height - sourceHeight * scale) * (Number.parseFloat(position[1]) / 100 || .5);
    callouts.forEach(({ element }) => {
      const label = element.querySelector('.catalog-callout-label');
      const svg = element.querySelector('.catalog-callout-arrow');
      if (!label || !svg) return;
      const box = label.getBoundingClientRect();
      const x = Number(element.dataset.targetX) * sourceWidth * scale + offsetX;
      const y = Number(element.dataset.targetY) * sourceHeight * scale + offsetY;
      const centerX = box.left - bounds.left + box.width / 2;
      const centerY = box.top - bounds.top + box.height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const horizontal = Math.abs(dx) / box.width >= Math.abs(dy) / box.height;
      const startX = centerX + (horizontal ? Math.sign(dx) * (box.width / 2 + 9) : 0);
      const startY = centerY + (horizontal ? 0 : Math.sign(dy) * (box.height / 2 + 9));
      const bend = Math.min(110, Math.max(24, Math.hypot(x - startX, y - startY) * .35));
      const c1x = startX + (horizontal ? Math.sign(dx) * bend : 0);
      const c1y = startY + (horizontal ? 0 : Math.sign(dy) * bend);
      const c2x = x - (horizontal ? Math.sign(dx) * bend * .5 : dx * .15);
      const c2y = y - (horizontal ? dy * .15 : Math.sign(dy) * bend * .5);
      const length = Math.max(1, Math.hypot(x - c2x, y - c2y));
      const ux = (x - c2x) / length;
      const uy = (y - c2y) / length;
      const tipX = x - ux * 6;
      const tipY = y - uy * 6;
      const point = (px, py) => px.toFixed(1) + ',' + py.toFixed(1);
      const line = 'M' + point(startX, startY) + ' C' + point(c1x, c1y) + ' ' + point(c2x, c2y) + ' ' + point(tipX, tipY);
      svg.setAttribute('viewBox', '0 0 ' + bounds.width + ' ' + bounds.height);
      element.querySelectorAll('.catalog-callout-shadow,.catalog-callout-line').forEach(path => path.setAttribute('d', line));
      element.querySelector('.catalog-callout-head')?.setAttribute('d', 'M' + point(tipX - ux * 9 - uy * 4.5, tipY - uy * 9 + ux * 4.5) + ' L' + point(tipX, tipY) + ' L' + point(tipX - ux * 9 + uy * 4.5, tipY - uy * 9 - ux * 4.5));
      const target = element.querySelector('.catalog-callout-target');
      target?.setAttribute('cx', String(x));
      target?.setAttribute('cy', String(y));
    });
    geometryDirty = false;
  };

  const sync = now => {
    frame = 0;
    if (disposed) return;
    video.pause();
    const headerHeight = header?.getBoundingClientRect().height ?? 66;
    if (headerHeight !== measuredHeader) {
      root.style.setProperty('--catalog-header-height', headerHeight + 'px');
      measuredHeader = headerHeight;
      geometryDirty = true;
    }
    if (geometryDirty) drawArrows();
    const rect = root.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const distance = Math.max(1, rect.height - stage.getBoundingClientRect().height);
    const progress = reduce.matches ? 1 : clamp((scrollY - sectionTop + headerHeight) / distance);
    root.style.setProperty('--catalog-progress', progress.toFixed(4));
    const annotationsReady = reduce.matches || (video.readyState >= 2 && video.currentTime >= video.duration - .12);
    callouts.forEach(({ element, start, end }) => {
      const reveal = reduce.matches ? 1 : annotationsReady ? clamp((progress - start) / Math.max(.001, end - start)) : 0;
      element.style.setProperty('--callout-progress', reveal.toFixed(4));
      element.setAttribute('aria-hidden', String(reveal <= .01));
    });
    if (hint) {
      const opacity = reduce.matches ? 0 : 1 - clamp(progress / .12);
      hint.style.opacity = opacity.toFixed(4);
      hint.setAttribute('aria-hidden', String(opacity <= .01));
    }
    if (!Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return;
    const target = (reduce.matches ? 1 : clamp(progress / .55)) * Math.max(0, video.duration - .03);
    const delta = target - video.currentTime;
    if (Math.abs(delta) <= .01) { lastTick = 0; return; }
    const elapsed = lastTick ? Math.min(64, now - lastTick) : 16.7;
    lastTick = now;
    video.currentTime = reduce.matches || Math.abs(delta) < .035
      ? target : video.currentTime + delta * (1 - Math.exp(-elapsed / 140));
    if (!video.seeking) schedule();
  };
  const schedule = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(sync);
  };
  const pause = () => video.pause();
  const refresh = () => { geometryDirty = true; schedule(); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', refresh);
  video.addEventListener('loadedmetadata', refresh);
  video.addEventListener('loadeddata', schedule);
  video.addEventListener('seeked', schedule);
  video.addEventListener('play', pause);
  reduce.addEventListener('change', refresh);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(refresh) : null;
  observer?.observe(stage);
  document.fonts?.ready.then(() => { if (!disposed) refresh(); });
  schedule();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    video.pause();
    removeEventListener('scroll', schedule);
    removeEventListener('resize', refresh);
    video.removeEventListener('loadedmetadata', refresh);
    video.removeEventListener('loadeddata', schedule);
    video.removeEventListener('seeked', schedule);
    video.removeEventListener('play', pause);
    reduce.removeEventListener('change', refresh);
    observer?.disconnect();
  };
}
