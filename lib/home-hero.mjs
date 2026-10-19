/** Play the home film once, preserving its final frame. Shared with HTML exports.
 * @param {HTMLVideoElement | null} video
 */
export function mountHomeHero(video) {
  if (!video) return () => {};
  const scene = video.closest('.hero-film');
  const button = scene?.querySelector('[data-film-toggle]');
  if (!scene || !button || typeof IntersectionObserver === 'undefined') return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let manualPause = false;
  let disposed = false;
  video.muted = true;
  video.playsInline = true;
  video.loop = false;

  const update = () => {
    const state = video.ended ? 'ended' : video.paused ? 'paused' : 'playing';
    button.dataset.state = state;
    const label = state === 'ended' ? 'Повторить анимацию' : state === 'playing' ? 'Приостановить анимацию' : 'Продолжить анимацию';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    const text = button.querySelector('[data-film-label]');
    if (text) text.textContent = state === 'ended' ? 'Повторить' : state === 'playing' ? 'Пауза' : 'Продолжить';
    button.hidden = reduce.matches || video.readyState < 2 || Boolean(video.error);
  };
  const play = () => {
    video.play().then(() => {
      if (disposed || reduce.matches || !inView || document.hidden || manualPause) video.pause();
    }).catch(() => { if (!disposed) { manualPause = true; update(); } });
  };
  const sync = () => {
    if (reduce.matches || !inView || document.hidden || manualPause || video.ended) video.pause();
    else if (video.readyState >= 2) play();
    update();
  };
  const toggle = () => {
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      manualPause = false;
      play();
    } else { manualPause = true; video.pause(); }
    update();
  };
  const fail = () => { scene.classList.add('film-unavailable'); update(); };
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .12;
    sync();
  }, { threshold: [0, .12] });
  observer.observe(scene);
  button.addEventListener('click', toggle);
  video.addEventListener('loadeddata', sync);
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  video.addEventListener('ended', update);
  video.addEventListener('error', fail);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  sync();

  return () => {
    disposed = true;
    observer.disconnect();
    button.removeEventListener('click', toggle);
    video.removeEventListener('loadeddata', sync);
    video.removeEventListener('play', update);
    video.removeEventListener('pause', update);
    video.removeEventListener('ended', update);
    video.removeEventListener('error', fail);
    document.removeEventListener('visibilitychange', sync);
    reduce.removeEventListener('change', sync);
    video.pause();
  };
}
