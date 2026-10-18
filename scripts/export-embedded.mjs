import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run after build and export-html.mjs. No browser or additional package needed.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.argv.includes('--preview');
const prefix = preview ? 'preview' : 'ramcad';
const pages = ['index', 'catalog', 'about', 'contacts'].map(page => ({
  input: `${page}.html`,
  output: `${prefix}${page === 'index' ? '' : `-${page}`}.html`,
}));
const destinations = new Map(pages.map(page => [page.input, page.output]));

const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4' };
for (const { input, output } of pages) {
  let html = await readFile(path.join(root, input), 'utf8');
  html = html.replace(/(\shref\s*=\s*)(["'])([^"'<>]*)\2/g, (attribute, start, quote, href) => {
    const internal = href.match(/^(?:\.\/|\/)?(index|catalog|about|contacts)\.html([?#].*)?$/);
    if (!internal) return attribute;
    return `${start}${quote}${destinations.get(`${internal[1]}.html`)}${internal[2] ?? ''}${quote}`;
  });
  html = html.replace(/\ssrc="(public\/[^"<>]+)"/g, ' data-embedded-src="$1"');
  const assets = {};
  for (const [, key] of html.matchAll(/data-embedded-src="(public\/[^"<>]+)"/g)) {
    if (Object.hasOwn(assets, key)) continue;
    let local = preview ? key.replace(/public\/images\/products\/(\d+)\.png$/, 'public/images/preview-products/$1.webp') : key;
    if (preview && key === 'public/images/hero-reference.png') local = 'public/images/preview-hero.webp';
    if (preview && key === 'public/images/directions/reference.png') local = 'public/images/directions/preview.webp';
    if (preview && key === 'public/videos/karta-scroll.mp4') local = 'public/videos/karta-preview.mp4';
    const resolved = path.resolve(root, local);
    if (!resolved.startsWith(path.join(root, 'public') + path.sep)) throw new Error('Asset escapes public directory.');
    const mime = mimeTypes[path.extname(local)];
    if (!mime) throw new Error(`Unsupported media type: ${local}`);
    const bytes = await readFile(resolved);
    assets[key] = `data:${mime};base64,${bytes.toString('base64')}`;
  }

  const boot = `<script type="application/json" id="embedded-assets">${JSON.stringify(assets)}</script><script>(()=>{const assets=JSON.parse(document.getElementById('embedded-assets').textContent);const hydrate=root=>root.querySelectorAll('[data-embedded-src]').forEach(el=>{el.src=assets[el.getAttribute('data-embedded-src')];el.removeAttribute('data-embedded-src')});hydrate(document);document.querySelectorAll('template').forEach(t=>hydrate(t.content));})();</script>`;
  if (!html.includes('<script>')) throw new Error(`Static runtime script is missing from ${input}.`);
  html = html.replace('<script>', boot + '<script>');
  await writeFile(path.join(root, output), html);
  console.log(`${output}: ${Buffer.byteLength(html)} bytes, ${Object.keys(assets).length} embedded media assets`);
}
