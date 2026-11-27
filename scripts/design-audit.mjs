/**
 * Design audit for RAMKAD.
 *
 * Runs headless Chrome through CDP and checks the pages that carry the most
 * layout risk: horizontal overflow, heading structure, broken images, console
 * errors, failed requests, the department switch, FAQ, news filters and
 * reduced motion. Saves screenshots next to the report.
 *
 * Usage:
 *   node scripts/design-audit.mjs
 *   AUDIT_BASE=http://127.0.0.1:3000 node scripts/design-audit.mjs
 *   AUDIT_WIDTHS=390,1280 node scripts/design-audit.mjs
 *
 * The default base points at the static preview served by the local helper
 * script. Override it when the site runs on another port or path.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const base = (process.env.AUDIT_BASE || 'http://127.0.0.1:8090/namelless888-creator/HTTPCHR/component-swap-preview').replace(/\/$/, '');
const dir = process.env.AUDIT_DIR || path.join(os.tmpdir(), 'opencode');
const widths = (process.env.AUDIT_WIDTHS || '320,360,390,768,1280,1920').split(',').map(Number);
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = Number(process.env.AUDIT_PORT || 9457);

await fs.mkdir(dir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(dir, 'ramcad-chrome')}`, 'about:blank',
], { stdio: 'ignore' });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const shots = [];
let ws;

try {
  let target;
  for (let i = 0; i < 40; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); if (target) break; } catch {}
    await wait(150);
  }
  if (!target) throw Error('Chrome did not start');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));

  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      message.error ? task.reject(Error(JSON.stringify(message.error))) : task.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) errors.push(`${message.params.response.status} ${message.params.response.url}`);
  };

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const shoot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const file = path.join(dir, `ramcad-${name}.png`);
    await fs.writeFile(file, Buffer.from(shot.data, 'base64'));
    shots.push(file);
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  const results = [];
  const routes = ['catalog/', 'about/', 'news/', 'news/2026-11-kanton-fair/'];

  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await send('Page.navigate', { url: `${base}/${route}` });
      await wait(1100);
      await evaluate('document.fonts.ready.then(() => true)');
      results.push(await evaluate(`(() => {
        const root = document.documentElement;
        return {
          width: innerWidth,
          route: location.pathname,
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          h1: document.querySelectorAll('h1').length,
          brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src),
          footerFill: document.querySelector('.footer-brand text') ? getComputedStyle(document.querySelector('.footer-brand text')).fill : null,
          overflow: [...document.querySelectorAll('main *')].filter(element => {
            const box = element.getBoundingClientRect();
            return box.width && box.right > root.clientWidth + 1
              && !element.closest('.catalog-atmosphere,.flavor-ribbon,.brand-hero,.collection-row,.partnership-final');
          }).slice(0, 8).map(element => ({ tag: element.tagName, cls: element.getAttribute('class'), right: element.getBoundingClientRect().right })),
        };
      })()`));

      if ((width === 390 || width === 1280) && !route.includes('2026')) {
        await shoot(`${route.replaceAll('/', '') || 'home'}-${width}`);
        if (route === 'catalog/') {
          await evaluate(`document.querySelector('.catalog-chapter').scrollIntoView({ behavior: 'instant' })`);
          await wait(350);
          await shoot(`switch-${width}`);
          await evaluate(`window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })`);
          await wait(350);
          await shoot(`footer-${width}`);
        }
      }

      if (width === 390 && route === 'catalog/') {
        results.push({ interaction: await evaluate(`(async () => {
          document.querySelectorAll('.department-tabs button')[1].click();
          await new Promise(resolve => setTimeout(resolve, 600));
          const fish = {
            cards: document.querySelectorAll('.product-grid .product-card').length,
            department: document.querySelector('#catalog').dataset.department,
          };
          document.querySelectorAll('.department-tabs button')[0].click();
          await new Promise(resolve => setTimeout(resolve, 200));
          document.querySelectorAll('.filter-tabs button')[1].click();
          await new Promise(resolve => setTimeout(resolve, 300));
          return { fish, filtered: document.querySelectorAll('.product-grid .product-card').length, pressed: document.querySelectorAll('.filter-tabs [aria-pressed="true"]').length };
        })()`) });
      }

      if (width === 390 && route === 'about/') {
        results.push({ faq: await evaluate(`(() => {
          const summary = document.querySelector('.about-faq summary');
          summary.click();
          return { open: summary.parentElement.open, count: document.querySelectorAll('.about-faq details').length };
        })()`) });
      }

      if (width === 390 && route === 'news/') {
        results.push({ newsFilter: await evaluate(`(async () => {
          document.querySelectorAll('.journal-filters button')[2].click();
          await new Promise(resolve => setTimeout(resolve, 200));
          return { cards: document.querySelectorAll('.journal-card').length };
        })()`) });
      }
    }
  }

  // Exercise real navigation and every migrated article.
  await send('Page.navigate', { url: `${base}/news/` });
  await wait(600);
  await evaluate(`document.querySelector('.journal-card').click()`);
  await wait(900);
  results.push({ navigation: await evaluate(`({ url: location.pathname, title: document.querySelector('h1')?.textContent, article: !!document.querySelector('.journal-body') })`) });

  for (const route of ['', 'news/2024-03-estate-quiz/', 'news/2024-02-marzo-lancman/', 'news/2024-02-melon-fruit-ice/', 'news/2024-02-70-flavors/']) {
    await send('Page.navigate', { url: `${base}/${route}` });
    await wait(700);
    results.push(await evaluate(`({
      route: location.pathname,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1: document.querySelectorAll('h1').length,
      brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src),
    })`));
  }

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url: `${base}/about/` });
  await wait(700);
  results.push({ reducedMotion: await evaluate(`({
    titleAnimation: getComputedStyle(document.querySelector('.brand-hero h1 span')).animationName,
    heroTransform: document.querySelector('.brand-hero-ice').style.transform,
  })`) });

  // Search dialog: scroll lock, keyboard trap, Escape restores focus.
  await send('Emulation.setEmulatedMedia', { features: [] });
  await send('Page.navigate', { url: `${base}/catalog/` });
  await wait(900);
  await evaluate(`document.querySelector('.header-search').click()`);
  await wait(350);
  results.push({ searchDialog: await evaluate(`(() => {
    const panel = document.querySelector('.site-search-inner');
    const items = [...panel.querySelectorAll('a[href], button, input')];
    items[items.length - 1].focus();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    const trapped = document.activeElement === items[0];
    return {
      open: !!panel,
      bodyOverflow: getComputedStyle(document.body).overflow,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content,
      cardDuration: getComputedStyle(document.querySelector('.product-grid > *')).animationDuration,
      tabTrapped: trapped,
    };
  })()`) });
  await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await wait(800);
  results.push({ searchClosed: await evaluate(`({
    open: !!document.querySelector('.site-search'),
    bodyOverflow: getComputedStyle(document.body).overflow,
    focusReturned: document.activeElement?.classList.contains('header-search'),
    scrollMargin: getComputedStyle(document.querySelector('#catalog-products')).scrollMarginTop,
  })`) });

  const report = { base, widths, shots, results, errors };
  await fs.writeFile(path.join(dir, 'ramcad-audit.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ base, widths, shots, errors, results }, null, 2));

  const failed = results.some(row =>
    (row.scrollWidth && row.clientWidth && row.scrollWidth > row.clientWidth)
    || (row.h1 !== undefined && row.h1 !== 1)
    || row.brokenImages?.length
    || row.footerFill === 'rgb(0, 0, 0)');
  if (failed || errors.length) process.exitCode = 1;
} finally {
  ws?.close();
  chrome.kill();
}
