import { readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Next 16.3 requests segment-prefetch files with dotted names, while export
// writes nested directories. Supply the requested names on plain static hosts.
const out = fileURLToPath(new URL('../out/', import.meta.url));
let copied = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else {
      const parts = path.relative(out, file).split(path.sep);
      const segment = parts.findIndex(part => part.startsWith('__next.'));
      if (segment >= 0 && segment < parts.length - 1 && entry.name.endsWith('.txt')) {
        await copyFile(file, path.join(out, ...parts.slice(0, segment), parts.slice(segment).join('.')));
        copied++;
      }
    }
  }
}
await walk(out);
console.log(`Prepared ${copied} static segment-prefetch files.`);
