import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { mountHeroParallax } from '../lib/hero-parallax.mjs';
import { mountHomeHero } from '../lib/home-hero.mjs';
import { mountMapIntro } from '../lib/map-intro.mjs';
import { mountMapScroll } from '../lib/map-scroll.mjs';
import { mountCatalogIntro } from '../lib/catalog-intro.mjs';

// Run after `npm run build`. Each route becomes an independent HTML page
// with embedded styles and fonts; local images and videos stay in public/.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = process.argv[2] ? path.resolve(process.argv[2]) : root;
const pages = [
  { route: '/', build: 'index.html', output: 'index.html' },
  { route: '/catalog', build: 'catalog.html', output: 'catalog.html' },
  { route: '/about', build: 'about.html', output: 'about.html' },
  { route: '/contacts', build: 'contacts.html', output: 'contacts.html' },
  { route: '/privacy', build: 'privacy.html', output: 'privacy.html' },
  { route: '/news', build: 'news.html', output: 'news.html' },
];
const newsSource = await readFile(path.join(root, 'lib/news.ts'), 'utf8');
const newsSlugs = [...newsSource.matchAll(/slug:\s*'([^']+)'/g)].map(match => match[1]);
pages.push(...newsSlugs.map(slug => ({ route: `/news/${slug}`, build: `news/${slug}.html`, output: `news-${slug}.html` })));
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const decodeEntities = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const catalogSource = await readFile(path.join(root, 'lib/catalog.ts'), 'utf8');
const entries = [...catalogSource.matchAll(/\{\s*src:\s*img\((\d+)\),\s*name:\s*'((?:\\.|[^'\\])*)'/g)].map(([, number, name]) => ({
  n: Number(number),
  name: name.replace(/\\(['\\])/g, '$1'),
}));
if (!entries.length || entries.some((entry, index) => entry.n !== index + 1)) {
  throw new Error(`Expected consecutively numbered catalog entries, got ${entries.length}; review the catalog parser.`);
}
// The card shows the short product line from the same `details` table the React app uses.
const productsSource = await readFile(path.join(root, 'lib/products.ts'), 'utf8');
const cardLines = [...productsSource.matchAll(/^\s*\['((?:\\.|[^'\\])*)',\s*'((?:\\.|[^'\\])*)'\],?$/gm)]
  .map(([, , description]) => description.replace(/\\(['\\])/g, '$1'));
if (cardLines.length !== entries.length) {
  throw new Error(`Expected ${entries.length} product lines in lib/products.ts, got ${cardLines.length}.`);
}
const herringSource = await readFile(path.join(root, 'lib/herring.ts'), 'utf8');
const herringModule = { exports: {} };
const herringCode = ts.transpileModule(herringSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function('module', 'exports', herringCode)(herringModule, herringModule.exports);
const herringProducts = herringModule.exports.HERRING_PRODUCTS;
if (!Array.isArray(herringProducts) || !herringProducts.length || herringProducts.some(item => !/^[a-z0-9-]+$/.test(item.id))) {
  throw new Error('Expected herring products with safe route IDs in lib/herring.ts.');
}
const herringAssets = new Set([
  '/images/herring/studio-ice.png',
  '/images/herring/packaging-tub.png',
  '/images/herring/waves.svg',
  ...herringProducts.flatMap(item => [item.fishImage, item.labelImage]),
]);
await Promise.all([...herringAssets].map(async source => {
  if (!source.startsWith('/images/herring/')) throw new Error(`Unexpected herring asset path: ${source}`);
  try {
    await access(path.join(root, 'public', source.slice(1)));
  } catch {
    throw new Error(`Missing herring asset: public${source}`);
  }
}));

pages.push(...entries.map(item => {
  const id = String(item.n).padStart(2, '0');
  return { route: `/product/${id}`, build: `product/${id}.html`, output: `product-${id}.html` };
}));
pages.push(...herringProducts.map(item => ({
  route: `/herring/${item.id}`,
  build: `herring/${item.id}.html`,
  output: `herring-${item.id}.html`,
})));
const routeFiles = new Map(pages.map(page => [page.route, page.output]));
// GitHub Pages serves this file for unknown paths.
pages.push({ route: '/404', build: '_not-found.html', output: '404.html' });
const staticHref = value => {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const url = new URL(value, 'https://local.invalid');
  const segments = url.pathname.split('/').filter(Boolean);
  for (let index = 0; index <= segments.length; index += 1) {
    const candidate = `/${segments.slice(index).join('/')}`;
    const file = routeFiles.get(candidate.replace(/\/+$/, '') || '/');
    if (file) return file + url.search + url.hash;
  }
  return value;
};

const categorySource = await readFile(path.join(root, 'lib/product-category.ts'), 'utf8');
const categoryModule = { exports: {} };
const categoryCode = ts.transpileModule(categorySource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function('module', 'exports', categoryCode)(categoryModule, categoryModule.exports);
const category = categoryModule.exports.productCategory;
if (typeof category !== 'function') {
  throw new Error('Expected productCategory in lib/product-category.ts.');
}
const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
const cards = entries.map((item, index) => {
  const number = String(item.n).padStart(2, '0');
  const name = escapeHtml(item.name);
  const brand = item.name.startsWith('MARZO') ? 'MARZO' : item.name.includes('Бурёнка') ? 'Бурёнка' : item.name.includes('My Love') ? 'My Love' : 'RAMKAD';
  return `<a href="product-${number}.html" class="product-card" data-product="${item.n}" data-category="${category(item.n)}" aria-label="Подробнее: ${name}"><div class="product-visual"><span class="product-category">${category(item.n)}</span><img src="public/images/product-cutouts/${number}.webp" alt="" width="600" height="800" loading="lazy" decoding="async"><span class="product-open">${arrow}</span></div><div class="product-info"><span class="product-brand">${brand}</span><h3>${escapeHtml(item.name.replace(/^MARZO\s*/, ''))}</h3><p class="product-taste">${escapeHtml(cardLines[index])}</p></div></a>`;
}).join('');
const fishCards = herringProducts.map(item => {
  const name = `${item.title} ${item.subtitle}`;
  return `<a href="herring-${escapeHtml(item.id)}.html" class="product-card" aria-label="Подробнее: ${escapeHtml(name)}, ${escapeHtml(item.weight)}"><div class="product-visual product-visual-fish"><span class="product-category">${escapeHtml(item.weight)}</span><div class="herring-card-pack" aria-hidden="true"><img class="herring-card-pack-base" src="public/images/herring/packaging-tub.png" alt="" width="1254" height="1254" loading="lazy" decoding="async"><img class="herring-card-pack-label" src="public${escapeHtml(item.labelImage)}" alt="" width="1401" height="1401" loading="lazy" decoding="async"></div><img class="herring-card-fish" src="public${escapeHtml(item.fishImage)}" alt="" width="1254" height="1254" loading="lazy" decoding="async"><span class="product-open">${arrow}</span></div><div class="product-info"><span class="product-brand">${escapeHtml(item.brand)} / ${escapeHtml(item.format)}</span><h3>${escapeHtml(name)}</h3><p class="product-taste">${escapeHtml(item.description)}</p></div></a>`;
}).join('');

const heroRuntime = `(${mountHeroParallax.toString()})(document.getElementById('hero'));`;
const homeFilmRuntime = `(${mountHomeHero.toString()})(document.querySelector('.hero-film-video'));`;
const introRuntime = `(${mountMapIntro.toString()})(video);`;
const mapScrollRuntime = `(${mountMapScroll.toString()})(video);`;
const catalogIntroRuntime = `(${mountCatalogIntro.toString()})(document.querySelector('.catalog-intro video'));`;
const runtime = String.raw`
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  ${heroRuntime}
  ${homeFilmRuntime}
  ${catalogIntroRuntime}
  const grid = document.querySelector('.product-grid');
  const source = document.getElementById('static-products');
  if (grid && source) {
    const products = [...source.content.querySelectorAll('.product-card')];
    const fishSource = document.getElementById('static-fish-products');
    const fishProducts = fishSource ? [...fishSource.content.querySelectorAll('.product-card')] : [];
    const filters = [...document.querySelectorAll('.filter-tabs button')];
    const filterBar = document.querySelector('.filter-tabs');
    const departmentButtons = [...document.querySelectorAll('.department-tabs button')];
    const count = document.querySelector('.catalog-count');
    const more = document.querySelector('.show-more');
    const search = document.querySelector('.catalog-search input');
    const searchClear = document.querySelector('.catalog-search button');
    const note = document.createElement('p');
    note.className = 'catalog-toolbar-note';
    note.textContent = 'Рыбные пресервы «Айсберг». Качество и поставка — под контролем RAMKAD.';
    note.hidden = true;
    count?.before(note);
    let department = new URL(location.href).searchParams.get('department') === 'fish' ? 'fish' : 'ice';
    let filter = 'Все вкусы';
    let expanded = false;
    let term = '';
    const flavorCount = n => n + ' ' + (n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов');
    const itemCount = n => n + ' ' + (n > 10 && n < 15 ? 'товаров' : n % 10 === 1 ? 'товар' : n % 10 >= 2 && n % 10 <= 4 ? 'товара' : 'товаров');
    const matchesTerm = card => !term || card.textContent.toLowerCase().includes(term);
    const insert = grid.querySelector('.grid-insert')?.cloneNode(true);
    const isCatalog = document.querySelector('.site-page-catalog');
    const render = () => {
      const isFish = department === 'fish';
      const matching = isFish
        ? fishProducts.filter(matchesTerm)
        : products.filter(card => (filter === 'Все вкусы' || card.dataset.category === filter) && matchesTerm(card));
      const shown = (isFish || expanded ? matching : matching.slice(0, 12)).map((card, index) => {
        const clone = card.cloneNode(true);
        clone.style.setProperty('--card-i', index);
        if (isCatalog && !isFish && filter === 'Все вкусы' && !term && index === 0) clone.classList.add('product-card-featured');
        return clone;
      });
      if (insert && !isFish && shown.length > 8) shown.splice(filter === 'Все вкусы' && !term ? 7 : 8, 0, insert.cloneNode(true));
      grid.replaceChildren(...shown);
      grid.classList.toggle('product-grid-duo', !!isCatalog && isFish);
      const section = document.querySelector('#catalog');
      if (section) section.dataset.department = department;
      const watermark = document.querySelector('.catalog-wordmark');
      if (watermark) watermark.textContent = isFish ? 'АЙСБЕРГ' : 'MARZO';
      const chapter = document.querySelector('.catalog-chapter');
      if (chapter) {
        chapter.querySelector('.catalog-chapter-index').textContent = isFish ? '02' : '01';
        chapter.querySelector('h2').textContent = isFish ? 'Рыба и морепродукты' : 'Мороженое';
        chapter.querySelector('.catalog-chapter-copy p').textContent = isFish ? 'Пресервы «Айсберг»: сельдь кусочками, филе и в масле.' : 'Рожки, эскимо, стаканчики, фруктовый лёд и семейные форматы MARZO.';
        chapter.querySelector('.catalog-chapter-count').textContent = isFish ? itemCount(fishProducts.length) : flavorCount(products.length);
      }
      const collections = document.querySelector('.collection-row');
      if (collections) collections.hidden = isFish;
      const searchRow = document.querySelector('.catalog-search');
      if (searchRow) searchRow.hidden = isFish;
      if (count) count.textContent = isFish ? itemCount(matching.length) : flavorCount(matching.length);
      if (filterBar) filterBar.style.display = isFish && departmentButtons.length ? 'none' : '';
      note.hidden = !isFish || !departmentButtons.length;
      if (searchClear) searchClear.hidden = !term;
      filters.forEach(button => {
        const label = button.dataset.filter || button.textContent.trim();
        const selected = label === 'Рыба' ? isFish : label === 'Мороженое' ? !isFish : !isFish && label === filter;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      departmentButtons.forEach((button, index) => {
        const selected = isFish ? index === 1 : index === 0;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      const indicator = document.querySelector('.filter-tab-indicator');
      const selected = filters.find(button => button.classList.contains('selected'));
      if (indicator && selected) {
        indicator.style.transform = 'translateX(' + selected.offsetLeft + 'px)';
        indicator.style.width = selected.offsetWidth + 'px';
      }
      if (more) {
        more.hidden = isFish || matching.length <= 12;
        more.firstChild.textContent = expanded ? 'Свернуть коллекцию' : 'Все ' + matching.length + ' вкусов';
        more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
      }
    };
    search?.addEventListener('input', () => {
      term = search.value.trim().toLowerCase();
      expanded = false;
      render();
    });
    searchClear?.addEventListener('click', () => {
      if (search) search.value = '';
      term = '';
      expanded = false;
      render();
    });
    filters.forEach(button => button.addEventListener('click', () => {
      const label = button.dataset.filter || button.textContent.trim();
      department = label === 'Рыба' ? 'fish' : 'ice';
      if (label !== 'Рыба') filter = label === 'Мороженое' ? 'Все вкусы' : label;
      expanded = false;
      const url = new URL(location.href);
      if (department === 'fish') url.searchParams.set('department', 'fish');
      else url.searchParams.delete('department');
      history.replaceState(null, '', url);
      render();
    }));
    departmentButtons.forEach((button, index) => button.addEventListener('click', () => {
      department = index === 1 ? 'fish' : 'ice';
      filter = 'Все вкусы'; term = '';
      if (search) search.value = '';
      expanded = false;
      const url = new URL(location.href);
      if (department === 'fish') url.searchParams.set('department', 'fish');
      else url.searchParams.delete('department');
      history.replaceState(null, '', url);
      render();
    }));
    more?.addEventListener('click', () => { expanded = !expanded; render(); });
    document.querySelectorAll('.collection-card').forEach(button => button.addEventListener('click', () => {
      filter = button.querySelector('.collection-name').textContent;
      expanded = false; term = '';
      if (search) search.value = '';
      render();
      document.querySelector('#catalog-products')?.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' });
    }));
    render();
  }

  const newsFilters = [...document.querySelectorAll('.journal-filters button')];
  newsFilters.forEach(button => button.addEventListener('click', () => {
    newsFilters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let count = 0;
    document.querySelectorAll('.journal > .journal-grid .journal-card').forEach(card => {
      card.hidden = button.textContent !== 'Все' && card.dataset.newsType !== button.textContent;
      if (!card.hidden) count++;
    });
    const live = document.querySelector('.journal [aria-live]');
    if (live) live.textContent = 'Материалов: ' + count;
  }));
  document.addEventListener('pointermove', event => {
    if (reduce.matches || event.pointerType !== 'mouse') return;
    const card = event.target.closest('.product-card, .catalog-hero-media, .direction-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', ((event.clientY - rect.top) / rect.height - .5) * -12 + 'deg');
      card.style.setProperty('--tilt-y', ((event.clientX - rect.left) / rect.width - .5) * 12 + 'deg');
    }
  });

  const herring = document.querySelector('.herring-details');
  if (herring) {
    const galleryButtons = [...herring.querySelectorAll('.herring-gallery-dots button')];
    const galleryLabels = ['Рыба и упаковка на льду', 'Упаковка крупным планом', 'Рыба на льду крупным планом'];
    galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
      herring.dataset.gallery = ['scene', 'pack', 'fish'][index];
      galleryButtons.forEach((other, otherIndex) => {
        const selected = otherIndex === index;
        other.classList.toggle('is-active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      const live = herring.querySelector('.herring-gallery .sr-only[aria-live]');
      if (live) live.textContent = galleryLabels[index];
    }));
    const dialog = herring.querySelector('.herring-dialog');
    const opener = herring.querySelector('.herring-wholesale button');
    opener?.addEventListener('click', () => dialog?.showModal());
    dialog?.querySelector('.herring-dialog-close')?.addEventListener('click', () => dialog.close());
    dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog?.addEventListener('close', () => opener?.focus());
  }

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
  // Contact details are visible in the HTML; the map is only decoration.
  if (video?.dataset.mapMode === 'intro') {
    ${introRuntime}
  } else if (video) {
    ${mapScrollRuntime}
  }
  reduce.addEventListener('change', () => {
    if (reduce.matches) reveals.forEach(element => element.classList.add('is-visible'));
  });
  if (reduce.matches) reveals.forEach(element => element.classList.add('is-visible'));
})();
`;

const staticStyles = `
.show-more[hidden]{display:none!important}
.reading-progress{transition:transform .25s ease-out}
.journal-card[hidden],.collection-row[hidden],.catalog-search[hidden]{display:none!important}
.about-manifesto p span{opacity:1!important}
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
  // CSS variables such as --img-hero carry the deployment base path; strip it
  // so the portable build keeps pointing at public/ next to the HTML file.
  const assetPrefix = html.match(/url\(&quot;([^&"]*?)\/images\//)?.[1] ?? '';
  if (assetPrefix) html = html.replaceAll(`${assetPrefix}/images/`, 'public/images/').replaceAll(`${assetPrefix}/videos/`, 'public/videos/');
  const stylesheetTags = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
  if (!stylesheetTags.length) throw new Error('The built page has no linked stylesheet.');
  const styles = [];
  for (const [tag] of stylesheetTags) {
    const href = tag.match(/href="([^"]+)"/)?.[1];
    const stylesheetPath = href?.includes('/_next/static/') ? href.slice(href.indexOf('/_next/static/')) : href;
    if (!stylesheetPath?.startsWith('/_next/static/')) throw new Error(`Unexpected stylesheet: ${href}`);
    const cssPath = path.join(root, '.next', stylesheetPath.slice('/_next/'.length));
    let css = await readFile(cssPath, 'utf8');
    const resources = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(match => match[1].replace(/^['"]|['"]$/g, '')))];
    for (const resource of resources) {
      if (!/\.woff2(?:\?.*)?$/.test(resource)) continue;
      const staticResource = resource.includes('/_next/static/') ? resource.slice(resource.indexOf('/_next/static/')) : resource;
      const fontPath = staticResource.startsWith('/_next/')
        ? path.join(root, '.next', staticResource.slice('/_next/'.length))
        : path.resolve(path.dirname(cssPath), staticResource);
      if (!fontPath.startsWith(path.join(root, '.next/static/'))) throw new Error('Font path escapes the static build directory.');
      const font = await readFile(fontPath);
      css = css.replaceAll(resource, `data:font/woff2;base64,${font.toString('base64')}`);
    }
    styles.push(css.replace(/url\((['"]?)([^)'"]*?\/(?:images|videos)\/[^)'"]+)\1\)/g, (_, quote, path) => `url(${quote}public${path.slice(path.search(/\/(?:images|videos)\//))}${quote})`));
    html = html.replace(tag, '');
  }

  html = html
    .replace(/<meta\b[^>]*name="robots"[^>]*>/gi, '<meta name="robots" content="noindex, nofollow"/>')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, tag => /type="application\/ld\+json"/.test(tag) ? tag : '')
    .replace(/<link\b[^>]*rel="(?:preload|modulepreload|prefetch|icon)"[^>]*>/gi, '')
    .replace(/<meta\b[^>]*name="next-size-adjust"[^>]*>/gi, '')
    .replace(/\s+srcSet="[^"]*"/gi, '')
    .replace(/\s+data-nimg="[^"]*"/gi, '')
    .replace(/\b(src|poster)="([^"]+)"/g, (match, attr, raw) => {
      let value = decodeEntities(raw);
      const query = value.indexOf('/_next/image?');
      if (query >= 0) value = new URL(value.slice(query), 'https://local.invalid').searchParams.get('url') ?? value;
      const asset = value.search(/\/(?:images|videos)\//);
      if (asset >= 0) value = `public${value.slice(asset)}`;
      return `${attr}="${escapeHtml(value)}"`;
    });

  html = html.replace('</head>', `<style>${styles.join('\n')}\n${staticStyles}</style></head>`);

  html = html.replace(/\bhref="([^"]+)"/g, (_, raw) => `href="${escapeHtml(staticHref(decodeEntities(raw)))}"`);
  const catalog = page.route === '/' || page.route === '/catalog' ? `<template id="static-products">${cards}</template>` : '';
  const fishCatalog = page.route === '/' || page.route === '/catalog' ? `<template id="static-fish-products">${fishCards}</template>` : '';
  html = html.replace('</body>', `${catalog}${fishCatalog}<script>${runtime}</script></body>`);
  if (html.includes('/_next/')) throw new Error(`An unresolved Next.js asset remains in ${page.output}.`);
  await writeFile(path.join(outputDirectory, page.output), html);
  console.log(`Exported ${page.output} with embedded CSS and local fonts${catalog ? `; ${entries.length} ice cream products` : ''}${fishCatalog ? `; ${herringProducts.length} fish products` : ''}.`);
}
