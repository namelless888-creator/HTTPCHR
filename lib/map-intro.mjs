/** Play the map reveal once on the contacts page; shared with HTML exports.
 * @param {HTMLVideoElement | null} video
 */
export function mountMapIntro(video) {
  if (!video) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  let started = false;
  video.muted = true;
  video.playsInline = true;
  video.loop = false;

  const finish = () => {
    video.pause();
    if (Number.isFinite(video.duration) && video.duration > 0) {
      const end = Math.max(0, video.duration - .05);
      if (Math.abs(video.currentTime - end) > .015) video.currentTime = end;
    }
  };
  const begin = () => {
    if (disposed) return;
    if (reduce.matches) { finish(); return; }
    if (started || video.readyState < 2) return;
    started = true;
    video.currentTime = 0;
    video.play().catch(() => { if (!disposed) finish(); });
  };
  const preferenceChanged = () => {
    if (reduce.matches) finish();
    else { started = false; begin(); }
  };
  video.addEventListener('loadedmetadata', begin);
  video.addEventListener('loadeddata', begin);
  reduce.addEventListener('change', preferenceChanged);
  begin();

  return () => {
    disposed = true;
    video.pause();
    video.removeEventListener('loadedmetadata', begin);
    video.removeEventListener('loadeddata', begin);
    reduce.removeEventListener('change', preferenceChanged);
  };
}
