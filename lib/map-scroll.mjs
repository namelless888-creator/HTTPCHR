/** Smoothly scrub the home map; also embedded in the standalone HTML.
 * @param {HTMLVideoElement | null} video
 */
export function mountMapScroll(video) {
  const section = video?.closest('.contacts-section');
  const header = document.querySelector('.main-header');
  if (!video || !section || !header) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTick = 0;
  let disposed = false;
  video.muted = true;
  const pause = () => video.pause();
  const sync = now => {
    frame = 0;
    if (disposed) return;
    pause();
    if (!Number.isFinite(video.duration) || video.readyState < 2 || video.seeking) return;
    const rect = section.getBoundingClientRect();
    const headerHeight = header.getBoundingClientRect().height;
    const top = scrollY + rect.top;
    const start = Math.max(0, top - innerHeight);
    const naturalEnd = top + rect.height - headerHeight - .1 * (innerHeight - headerHeight);
    const end = Math.max(start + 1, Math.min(naturalEnd, document.documentElement.scrollHeight - innerHeight - 64));
    const progress = reduce.matches ? 1 : Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
    const target = progress * Math.max(0, video.duration - 1 / 60);
    const delta = target - video.currentTime;
    const elapsed = lastTick ? Math.min(40, Math.max(1, now - lastTick)) : 16.7;
    lastTick = now;
    if (Math.abs(delta) <= .008) {
      lastTick = 0;
      if (Math.abs(delta) > .0005) video.currentTime = target;
      return;
    }
    // Limit large wheel/trackpad jumps as well as easing small adjustments.
    const limit = video.duration * elapsed / 2000;
    const eased = delta * (1 - Math.exp(-elapsed / 300));
    video.currentTime = reduce.matches || Math.abs(delta) < .018
      ? target : video.currentTime + Math.max(-limit, Math.min(limit, eased));
  };
  const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(sync); };
  video.addEventListener('loadedmetadata', schedule);
  video.addEventListener('loadeddata', schedule);
  video.addEventListener('seeked', schedule);
  video.addEventListener('play', pause);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduce.addEventListener('change', schedule);
  schedule();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    pause();
    video.removeEventListener('loadedmetadata', schedule);
    video.removeEventListener('loadeddata', schedule);
    video.removeEventListener('seeked', schedule);
    video.removeEventListener('play', pause);
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
    reduce.removeEventListener('change', schedule);
  };
}
