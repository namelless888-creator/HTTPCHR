export const CONE_SILHOUETTE = 'M102 8C100 29 63 36 64 57C42 59 30 75 37 93C15 103 19 132 39 139L93 286Q100 300 107 286L161 139C182 132 187 104 164 93C172 74 156 59 137 57C137 39 112 35 102 8Z';
export const CONE_MASK = 'url("data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><path d="${CONE_SILHOUETTE}" fill="black"/></svg>`) + '")';

/** Scroll-pinned cone portal, shared by React and the standalone exports.
 * @param {HTMLElement | null} section
 * @param {string} maskImage
 */
export function mountConeScrollTransition(section, maskImage) {
  if (!section) return () => {};
  const windowLayer = section.querySelector('.cone-window');
  const pin = section.querySelector('.cone-pin');
  const header = document.querySelector('.main-header');
  if (!windowLayer || !pin || !header) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let current = null;
  let lastTime = 0;
  const reset = () => {
    section.removeAttribute('data-cone-ready');
    section.style.removeProperty('--cone-y');
    section.style.removeProperty('--cone-height');
    section.style.removeProperty('--cone-size');
    section.style.removeProperty('--cone-scale');
    section.style.removeProperty('--cone-opacity');
    windowLayer.removeAttribute('style');
    current = null;
    lastTime = 0;
  };
  const tick = now => {
    frame = 0;
    if (reduce.matches) { reset(); return; }
    section.setAttribute('data-cone-ready', '');
    const pinHeight = pin.getBoundingClientRect().height;
    const scrollDistance = Math.min(1200, Math.max(520, innerHeight * 1.2));
    section.style.setProperty('--cone-height', (pinHeight + scrollDistance) + 'px');
    const rect = section.getBoundingClientRect();
    const headerHeight = header.getBoundingClientRect().height;
    const travel = Math.max(1, rect.height - pinHeight);
    const target = Math.min(1, Math.max(0, (headerHeight - rect.top) / travel));
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16.7;
    const alpha = 1 - Math.exp(-elapsed / 160);
    current = current === null ? target : current + (target - current) * alpha;
    if (Math.abs(current - target) < .0005) current = target;
    lastTime = now;
    const initialSize = Math.min(280, Math.max(150, innerWidth * .23));
    const y = Math.min(pinHeight / 2, (innerHeight - headerHeight) * .48);
    const size = initialSize + Math.pow(current, 2.3) * Math.max(innerWidth, pinHeight) * 8;
    const fade = Math.min(1, current / .48);
    section.style.setProperty('--cone-y', y + 'px');
    section.style.setProperty('--cone-size', initialSize + 'px');
    section.style.setProperty('--cone-scale', String(size / initialSize));
    section.style.setProperty('--cone-opacity', String(1 - fade * fade * (3 - 2 * fade)));
    // Drop the mask before the pin ends so long mobile company content stays readable.
    windowLayer.style.maskImage = current >= .96 ? 'none' : maskImage;
    windowLayer.style.webkitMaskImage = windowLayer.style.maskImage;
    windowLayer.style.maskSize = `${size}px ${size * 1.5}px`;
    windowLayer.style.maskPosition = `50% ${y - size * .75}px`;
    windowLayer.style.webkitMaskSize = windowLayer.style.maskSize;
    windowLayer.style.webkitMaskPosition = windowLayer.style.maskPosition;
    if (current !== target) frame = requestAnimationFrame(tick);
    else lastTime = 0;
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
