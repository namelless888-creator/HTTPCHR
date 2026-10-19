/** Play the catalog introduction once; shared by React and standalone HTML.
 * Keep this function self-contained so exports can embed its source.
 * @param {HTMLVideoElement | null} video
 */
export function mountCatalogIntro(video) {
  if (!video) return () => {};
  const parent = video.closest('.catalog-intro');
  const replay = parent?.querySelector('[data-catalog-replay]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  let started = false;
  let state = 'idle';
  let request = 0;
  video.muted = true;
  video.playsInline = true;
  video.loop = false;

  const seekEnd = () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const end = Math.max(0, video.duration - .01);
    if (Math.abs(video.currentTime - end) > .015) video.currentTime = end;
  };
  const finish = () => {
    if (disposed) return;
    request++;
    started = true;
    state = 'finished';
    video.pause();
    seekEnd();
    if (parent) parent.dataset.introState = state;
    if (replay) replay.hidden = reduce.matches;
  };
  const begin = () => {
    if (disposed) return;
    if (reduce.matches) { finish(); return; }
    if (started || video.readyState < 2) return;
    started = true;
    state = 'playing';
    const attempt = ++request;
    video.currentTime = 0;
    if (parent) parent.dataset.introState = state;
    if (replay) replay.hidden = true;
    try {
      Promise.resolve(video.play()).then(() => {
        if (disposed || reduce.matches || (attempt !== request && state !== 'playing')) video.pause();
      }).catch(() => {
        if (!disposed && attempt === request) finish();
      });
    } catch {
      finish();
    }
  };
  const ready = () => {
    if (disposed) return;
    if (state === 'finished') seekEnd();
    else begin();
  };
  const restart = () => {
    if (disposed || reduce.matches) return;
    started = false;
    state = 'idle';
    begin();
  };
  const preferenceChanged = () => {
    if (reduce.matches) finish();
    else if (state === 'finished') { if (replay) replay.hidden = false; }
    else begin();
  };
  video.addEventListener('loadedmetadata', ready);
  video.addEventListener('loadeddata', ready);
  video.addEventListener('ended', finish);
  replay?.addEventListener('click', restart);
  reduce.addEventListener('change', preferenceChanged);
  begin();

  return () => {
    disposed = true;
    request++;
    video.pause();
    video.removeEventListener('loadedmetadata', ready);
    video.removeEventListener('loadeddata', ready);
    video.removeEventListener('ended', finish);
    replay?.removeEventListener('click', restart);
    reduce.removeEventListener('change', preferenceChanged);
  };
}
