/** Shared browser runtime for the React hero and standalone HTML exports.
 * @param {HTMLElement | null} hero
 */
export function mountHeroParallax(hero) {
  if (!hero) return () => {};
  const photo = hero.querySelector('.reference-hero-photo');
  const header = document.querySelector('.main-header');
  const brand = header?.querySelector('.header-brand-hero');
  if (!photo || !header) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTime = 0;
  let photoY = 0;
  let copyY = 0;
  let brandProgress = 0;
  let brandReady = false;
  const paintBrand = progress => {
    if (!brand) return;
    const rect = hero.getBoundingClientRect();
    const mobile = innerWidth <= 700;
    const targetX = rect.left + rect.width * (mobile ? .31 : .18);
    const targetY = Math.min(rect.height * (mobile ? .38 : .42), innerHeight * .4);
    const homeX = header.getBoundingClientRect().left + brand.offsetLeft + brand.offsetWidth / 2;
    const homeY = header.getBoundingClientRect().top + brand.offsetTop + brand.offsetHeight / 2;
    const remaining = 1 - progress;
    brand.style.setProperty('--brand-shift-x', ((targetX - homeX) * remaining).toFixed(2) + 'px');
    brand.style.setProperty('--brand-shift-y', ((targetY - homeY) * remaining).toFixed(2) + 'px');
    brand.style.setProperty('--brand-scale', (1 + (mobile ? .95 : 1.65) * remaining).toFixed(3));
    brand.style.setProperty('--brand-plaque-opacity', Math.pow(progress, 1.3).toFixed(3));
    brand.style.setProperty('--brand-hero-emphasis', Math.pow(remaining, .75).toFixed(3));
    const start = [241, 246, 248];
    const end = [16, 52, 60];
    brand.style.setProperty('--brand-text-rgb', start.map((value, index) => Math.round(value + (end[index] - value) * progress)).join(' '));
  };
  const reset = () => {
    photoY = 0;
    copyY = 0;
    lastTime = 0;
    hero.style.removeProperty('--hero-parallax-photo');
    hero.style.removeProperty('--hero-parallax-copy');
    hero.removeAttribute('data-parallax-active');
    if (brand) {
      brand.style.removeProperty('--brand-shift-x');
      brand.style.removeProperty('--brand-shift-y');
      brand.style.removeProperty('--brand-scale');
      brand.style.removeProperty('--brand-plaque-opacity');
      brand.style.removeProperty('--brand-hero-emphasis');
      brand.style.removeProperty('--brand-text-rgb');
    }
  };
  const tick = now => {
    frame = 0;
    if (reduce.matches) { paintBrand(1); return; }
    const rect = hero.getBoundingClientRect();
    const targetBrand = Math.min(1, Math.max(0, -rect.top / (rect.height * .72)));
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16.7;
    const alpha = 1 - Math.exp(-elapsed / 110);
    if (!brandReady) { brandProgress = targetBrand; brandReady = true; }
    else brandProgress += (targetBrand - brandProgress) * alpha;
    paintBrand(brandProgress);
    if (rect.bottom <= 0 || rect.top >= innerHeight) {
      hero.removeAttribute('data-parallax-active');
      lastTime = now;
      if (Math.abs(targetBrand - brandProgress) > .001) frame = requestAnimationFrame(tick);
      return;
    }
    const baseline = getComputedStyle(header).position === 'fixed' ? 0 : header.getBoundingClientRect().height;
    const progress = Math.min(1, Math.max(0, (baseline - rect.top) / rect.height));
    // Stay inside the photograph's existing crop, including narrow screens.
    const targetPhoto = progress * Math.min(32, photo.getBoundingClientRect().height * .06);
    const targetCopy = -progress * Math.min(14, rect.height * .02);
    const photoAlpha = 1 - Math.exp(-elapsed / 180);
    lastTime = now;
    photoY += (targetPhoto - photoY) * photoAlpha;
    copyY += (targetCopy - copyY) * photoAlpha;
    hero.setAttribute('data-parallax-active', '');
    hero.style.setProperty('--hero-parallax-photo', photoY.toFixed(3) + 'px');
    hero.style.setProperty('--hero-parallax-copy', copyY.toFixed(3) + 'px');
    if (Math.abs(targetPhoto - photoY) + Math.abs(targetCopy - copyY) > .02 || Math.abs(targetBrand - brandProgress) > .001) {
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
