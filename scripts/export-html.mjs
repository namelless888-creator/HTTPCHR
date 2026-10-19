import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mountHeroParallax } from '../lib/hero-parallax.mjs';
import { mountMapIntro } from '../lib/map-intro.mjs';
import { mountCatalogIntro } from '../lib/catalog-intro.mjs';

// Run after `npm run build`. Each route becomes an independent HTML page
// with embedded styles and fonts; local images and videos stay in public/.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  { route: '/', build: 'index.html', output: 'index.html' },
  { route: '/catalog', build: 'catalog.html', output: 'catalog.html' },
  { route: '/about', build: 'about.html', output: 'about.html' },
  { route: '/contacts', build: 'contacts.html', output: 'contacts.html' },
];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const decodeEntities = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const catalogSource = await readFile(path.join(root, 'lib/catalog.ts'), 'utf8');
const entries = [...catalogSource.matchAll(/\{\s*src:\s*img\((\d+)\),\s*name:\s*'((?:\\.|[^'\\])*)'([^}]*)\}/g)].map(([, number, name, rest]) => ({
  n: Number(number),
  name: name.replace(/\\(['\\])/g, '$1'),
  hot: /hot:\s*true/.test(rest),
}));
if (entries.length !== 36 || entries.some((entry, index) => entry.n !== index + 1)) {
  throw new Error('Expected 36 consecutively numbered catalog entries; review the catalog parser.');
}

pages.push(...entries.map(item => {
  const id = String(item.n).padStart(2, '0');
  return { route: `/product/${id}`, build: `product/${id}.html`, output: `product-${id}.html` };
}));
const routeFiles = new Map(pages.map(page => [page.route, page.output]));
const staticHref = value => {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const url = new URL(value, 'https://local.invalid');
  const file = routeFiles.get(url.pathname.replace(/\/+$/, '') || '/');
  return file ? file + url.search + url.hash : value;
};

const category = n => [2, 4, 6, 7, 9, 18, 19, 20].includes(n) ? 'Рожки'
  : [3, 10, 13, 14, 28, 36].includes(n) ? 'Фруктовый лёд'
  : [16, 17, 32, 33, 34, 35].includes(n) ? 'Для семьи'
  : [23, 24, 25].includes(n) ? 'Стаканчики' : 'Эскимо';
const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
const cards = entries.map(item => {
  const number = String(item.n).padStart(2, '0');
  const name = escapeHtml(item.name);
  return `<a href="product-${number}.html" class="product-card" data-product="${item.n}" data-category="${category(item.n)}" aria-label="Подробнее: ${name}"><div class="product-visual"><span class="product-category">${category(item.n)}</span>${item.hot ? '<span class="product-label">Любимый вкус</span>' : ''}<img src="public/images/products/${number}.png" alt="${name}" width="600" height="800" loading="lazy" decoding="async"><span class="product-open">${arrow}</span></div><div class="product-info"><span>MARZO / ${number}</span><h3>${escapeHtml(item.name.replace(/^MARZO\s*/, ''))}</h3></div></a>`;
}).join('');

const heroRuntime = `(${mountHeroParallax.toString()})(document.getElementById('hero'));`;
const introRuntime = `(${mountMapIntro.toString()})(video);`;
const catalogIntroRuntime = `(${mountCatalogIntro.toString()})(document.querySelector('.catalog-intro video'));`;
const runtime = String.raw`
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  ${heroRuntime}
  ${catalogIntroRuntime}
  const grid = document.querySelector('.product-grid');
  const source = document.getElementById('static-products');
  if (grid && source) {
    const products = [...source.content.querySelectorAll('.product-card')];
    const filters = [...document.querySelectorAll('.filter-tabs button')];
    const count = document.querySelector('.catalog-toolbar > span');
    const more = document.querySelector('.show-more');
    let filter = 'Все вкусы';
    let expanded = false;
    const flavorCount = n => n + ' ' + (n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов');
    const render = () => {
      const matching = products.filter(card => filter === 'Все вкусы' || card.dataset.category === filter);
      grid.replaceChildren(...(expanded ? matching : matching.slice(0, 8)).map(card => card.cloneNode(true)));
      count.textContent = flavorCount(matching.length);
      filters.forEach(button => {
        const selected = button.textContent.trim() === filter;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      more.hidden = matching.length <= 8;
      more.firstChild.textContent = expanded ? 'Свернуть коллекцию' : 'Все ' + matching.length + ' вкусов';
      more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
    };
    filters.forEach(button => button.addEventListener('click', () => {
      filter = button.textContent.trim(); expanded = false; render();
    }));
    more.addEventListener('click', () => { expanded = !expanded; render(); });
    render();
  }

  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('main-navigation');
  const menuIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>';
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    toggle.innerHTML = (open ? closeIcon : menuIcon) + '<span class="header-menu-label">Меню</span>';
    if (open) nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  nav.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => setMenu(false)));

  const reveals = [...document.querySelectorAll('.reveal')];
  if (typeof IntersectionObserver === 'function') {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .1 });
    reveals.forEach(element => { element.classList.add('reveal-ready'); revealObserver.observe(element); });
  } else reveals.forEach(element => element.classList.add('is-visible'));

  const progress = document.querySelector('.reading-progress');
  let scheduled = false;
  const updateProgress = () => {
    const length = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (length > 0 ? scrollY / length : 0) + ')';
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  addEventListener('resize', updateProgress); updateProgress();

  const video = document.querySelector('.map-section video');
  if (video?.dataset.mapMode === 'intro') {
    ${introRuntime}
  } else if (video) {
    video.muted = true;
    let mapFrame = 0;
    let mapLastTick = 0;
    const syncVideo = () => {
      mapFrame = 0;
      video.pause();
      if (!Number.isFinite(video.duration) || video.seeking) return;
      const rect = video.closest('.contacts-section').getBoundingClientRect();
      const headerHeight = document.querySelector('.main-header').getBoundingClientRect().height;
      const sectionTop = scrollY + rect.top;
      const start = Math.max(0, sectionTop - innerHeight);
      const naturalEnd = sectionTop + rect.height - headerHeight - .1 * (innerHeight - headerHeight);
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const end = Math.max(start + 1, Math.min(naturalEnd, maxScroll - 64));
      const progress = reduce.matches ? 1 : Math.min(1, Math.max(0,
        (scrollY - start) / (end - start)));
      const target = progress * Math.max(0, video.duration - .05);
      const now = performance.now();
      const elapsed = mapLastTick ? Math.min(64, now - mapLastTick) : 16.7;
      mapLastTick = now;
      const distance = target - video.currentTime;
      if (Math.abs(distance) <= .015) { mapLastTick = 0; return; }
      const time = reduce.matches || Math.abs(distance) < .04
        ? target : video.currentTime + distance * (1 - Math.exp(-elapsed / 220));
      video.currentTime = time;
    };
    const scheduleMap = () => { if (!mapFrame) mapFrame = requestAnimationFrame(syncVideo); };
    video.addEventListener('loadedmetadata', scheduleMap);
    video.addEventListener('seeked', scheduleMap);
    addEventListener('scroll', scheduleMap, { passive: true });
    addEventListener('resize', scheduleMap);
    reduce.addEventListener('change', scheduleMap);
    syncVideo();
  }
  reduce.addEventListener('change', () => {
    if (reduce.matches) reveals.forEach(element => element.classList.add('is-visible'));
  });
  if (reduce.matches) reveals.forEach(element => element.classList.add('is-visible'));
})();
`;

const staticStyles = `
.show-more[hidden]{display:none!important}
`;

const builtPages = await Promise.all(pages.map(async page => {
  try {
    return { ...page, html: await readFile(path.join(root, '.next/server/app', page.build), 'utf8') };
  } catch {
    throw new Error(`Build output for ${page.route} is missing. Run npm run build before node scripts/export-html.mjs.`);
  }
}));

for (const page of builtPages) {
  let html = page.html;
  const stylesheetTags = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
  if (!stylesheetTags.length) throw new Error('The built page has no linked stylesheet.');
  const styles = [];
  for (const [tag] of stylesheetTags) {
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (!href?.startsWith('/_next/static/')) throw new Error(`Unexpected stylesheet: ${href}`);
    const cssPath = path.join(root, '.next', href.slice('/_next/'.length));
    let css = await readFile(cssPath, 'utf8');
    const resources = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(match => match[1].replace(/^['"]|['"]$/g, '')))];
    for (const resource of resources) {
      if (!/\.woff2(?:\?.*)?$/.test(resource)) continue;
      const fontPath = resource.startsWith('/_next/')
        ? path.join(root, '.next', resource.slice('/_next/'.length))
        : path.resolve(path.dirname(cssPath), resource);
      if (!fontPath.startsWith(path.join(root, '.next/static/'))) throw new Error('Font path escapes the static build directory.');
      const font = await readFile(fontPath);
      css = css.replaceAll(resource, `data:font/woff2;base64,${font.toString('base64')}`);
    }
    styles.push(css);
    html = html.replace(tag, '');
  }

  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*rel="(?:preload|modulepreload|prefetch|icon)"[^>]*>/gi, '')
    .replace(/<meta\b[^>]*name="next-size-adjust"[^>]*>/gi, '')
    .replace(/\s+srcSet="[^"]*"/gi, '')
    .replace(/\s+data-nimg="[^"]*"/gi, '')
    .replace(/\b(src|poster)="([^"]+)"/g, (match, attr, raw) => {
      let value = decodeEntities(raw);
      if (value.startsWith('/_next/image?')) value = new URL(value, 'https://local.invalid').searchParams.get('url') ?? value;
      if (value.startsWith('/images/') || value.startsWith('/videos/')) value = `public${value}`;
      return `${attr}="${escapeHtml(value)}"`;
    });

  html = html.replace('</head>', `<style>${styles.join('\n')}\n${staticStyles}</style></head>`);

  html = html.replace(/\bhref="([^"]+)"/g, (_, raw) => `href="${escapeHtml(staticHref(decodeEntities(raw)))}"`);
  const catalog = page.route === '/' || page.route === '/catalog' ? `<template id="static-products">${cards}</template>` : '';
  html = html.replace('</body>', `${catalog}<script>${runtime}</script></body>`);
  if (html.includes('/_next/')) throw new Error(`An unresolved Next.js asset remains in ${page.output}.`);
  await writeFile(path.join(root, page.output), html);
  console.log(`Exported ${page.output} with embedded CSS and local fonts${catalog ? `; ${entries.length} catalog products` : ''}.`);
}
