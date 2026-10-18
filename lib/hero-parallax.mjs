/** Shared browser runtime for the React hero and standalone HTML exports.
 * @param {HTMLElement | null} hero
 */
export function mountHeroParallax(hero) {
  if (!hero) return () => {};
  const photo = hero.querySelector('.reference-hero-photo');
  const header = document.querySelector('.main-header');
  if (!photo || !header) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTime = 0;
  let photoY = 0;
  let copyY = 0;
  const reset = () => {
    photoY = 0;
    copyY = 0;
    lastTime = 0;
    hero.style.removeProperty('--hero-parallax-photo');
    hero.style.removeProperty('--hero-parallax-copy');
    hero.removeAttribute('data-parallax-active');
  };
  const tick = now => {
    frame = 0;
    if (reduce.matches) { reset(); return; }
    const rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight) {
      hero.removeAttribute('data-parallax-active');
      lastTime = 0;
      return;
    }
    const progress = Math.min(1, Math.max(0,
      (header.getBoundingClientRect().height - rect.top) / rect.height));
    // Stay inside the photograph's existing crop, including narrow screens.
    const targetPhoto = progress * Math.min(48, photo.getBoundingClientRect().height * .08);
    const targetCopy = -progress * Math.min(18, rect.height * .025);
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16.7;
    const alpha = 1 - Math.exp(-elapsed / 100);
    lastTime = now;
    photoY += (targetPhoto - photoY) * alpha;
    copyY += (targetCopy - copyY) * alpha;
    hero.setAttribute('data-parallax-active', '');
    hero.style.setProperty('--hero-parallax-photo', photoY.toFixed(3) + 'px');
    hero.style.setProperty('--hero-parallax-copy', copyY.toFixed(3) + 'px');
    if (Math.abs(targetPhoto - photoY) + Math.abs(targetCopy - copyY) > .02) {
      frame = requestAnimationFrame(tick);
    } else lastTime = 0;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduce.addEventListener('change', schedule);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
    reduce.removeEventListener('change', schedule);
    reset();
  };
}
