import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/videos/karta_animation.mp4');
// Render on the same filesystem so replacing each completed asset is atomic.
const temporary = await mkdtemp(path.join(root, '.map-media-'));

// Keep the uploaded white/navy artwork. Upscaling improves its presentation;
// it cannot recover detail absent from the 848 × 464 original.
const enhance = 'scale=1920:-2:flags=lanczos,setsar=1,unsharp=5:5:0.55:3:3:0';
const duration = String(257 / 30);
const run = args => execFileSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y', ...args,
], { stdio: 'inherit' });
const encode = (name, intro) => run([
  '-ss', '3.1', '-t', duration, '-i', source, '-an',
  '-vf', `${intro ? 'setpts=(PTS-STARTPTS)/3,' : ''}${enhance},fps=${intro ? 60 : 30}`,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '15',
  '-pix_fmt', 'yuv420p', '-threads', '2',
  '-g', intro ? '30' : '5', '-keyint_min', intro ? '30' : '5',
  '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart',
  path.join(temporary, name),
]);

try {
  encode('karta-scroll.mp4', false);
  encode('karta-intro.mp4', true);
  // The standalone preview must show the same quality as the application.
  await copyFile(path.join(temporary, 'karta-scroll.mp4'), path.join(temporary, 'karta-preview.mp4'));
  run(['-i', path.join(temporary, 'karta-intro.mp4'), '-frames:v', '1',
    '-c:v', 'libwebp', '-lossless', '1', path.join(temporary, 'map-start.webp')]);
  run(['-ss', '13.8', '-i', source, '-frames:v', '1', '-vf', enhance,
    '-c:v', 'libwebp', '-lossless', '1', path.join(temporary, 'map-preview.webp')]);
  for (const name of ['karta-scroll.mp4', 'karta-intro.mp4', 'karta-preview.mp4', 'map-start.webp', 'map-preview.webp']) {
    const folder = name.endsWith('.mp4') ? 'videos' : 'images';
    await rename(path.join(temporary, name), path.join(root, 'public', folder, name));
  }
  console.log('Map media refreshed: 1920 px wide, original aspect ratio, white/navy artwork.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
