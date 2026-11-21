// Render native SVG layout references. This does not run or screenshot the HTML.
const fs = require('node:fs/promises');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); } catch { sharp = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/sharp'); }
const root = path.resolve(__dirname,'..');
async function inlineImages(file) {
  let svg = await fs.readFile(file,'utf8');
  const refs = [...svg.matchAll(/<image\b[^>]*\bhref="([^"]+)"/g)].map(m => m[1]);
  for (const ref of [...new Set(refs)]) {
    if (ref.startsWith('data:')) continue;
    const absolute = path.resolve(path.dirname(file),ref);
    if (!absolute.startsWith(root+path.sep)) throw new Error('Asset outside kit: '+ref);
    const bytes = await fs.readFile(absolute);
    const mime = absolute.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    svg = svg.split('href="'+ref+'"').join('href="data:'+mime+';base64,'+bytes.toString('base64')+'"');
  }
  return svg;
}
(async()=>{
  const products = JSON.parse(await fs.readFile(path.join(root,'products.json'),'utf8'));
  for (const product of process.argv.includes('--overview-only') ? [] : products) {
    const dir = path.join(root,'products',product.id);
    const svg = await inlineImages(path.join(dir,'layout.svg'));
    await sharp(Buffer.from(svg)).png().toFile(path.join(dir,'mockup.png'));
    console.log(product.id);
  }
  const overview = path.join(root,'previews','collection-overview.svg');
  try { await fs.access(overview); await sharp(Buffer.from(await inlineImages(overview))).png().toFile(path.join(root,'previews','collection-overview.png')); console.log('collection-overview'); }
  catch(error) { if (error.code !== 'ENOENT') throw error; }
})().catch(error=>{console.error(error);process.exitCode=1});
