import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/videos/karta_animation.mp4');
// The red channel separates the original blue ink from the sepia paper.
// PCHIP curves keep dark routes legible while lifting the paper to cool white.
const grade = "colorchannelmixer=rr=1:rg=0:rb=0:gr=1:gg=0:gb=0:br=1:bg=0:bb=0,curves=r='0/0.035 0.14/0.07 0.27/0.35 0.38/0.87 0.55/0.96 1/0.98':g='0/0.12 0.14/0.20 0.27/0.47 0.38/0.90 0.55/0.98 1/0.99':b='0/0.18 0.14/0.29 0.27/0.56 0.38/0.93 0.55/0.99 1/1':interp=pchip,unsharp=5:5:0.25:3:3:0,format=yuv420p";
const run = args => {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg exited with status ${result.status}`);
};
for (const { name, crf, intro } of [
  { name: 'karta-scroll.mp4', crf: 17, intro: false },
  { name: 'karta-preview.mp4', crf: 18, intro: false },
  { name: 'karta-intro.mp4', crf: 17, intro: true },
]) {
  const output = path.join(root, 'public/videos', name);
  run([...(intro ? ['-ss', '3'] : []), '-i', source,
    '-vf', intro ? `setpts=(PTS-STARTPTS)/3,fps=60,${grade}` : grade,
    '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', String(crf),
    '-g', intro ? '30' : '6', '-keyint_min', intro ? '30' : '6', '-sc_threshold', '0',
    '-movflags', '+faststart', output]);
  console.log(`${name}: ${(statSync(output).size / 1024 / 1024).toFixed(2)} MiB`);
}
run(['-i', 'public/videos/karta-intro.mp4', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '96', 'public/images/map-start.webp']);
run(['-ss', '13.9', '-i', 'public/videos/karta-scroll.mp4', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '96', 'public/images/map-preview.webp']);
