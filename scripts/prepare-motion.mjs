import { spawn } from 'node:child_process';
import { mkdtemp, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporary = await mkdtemp(path.join(root, '.motion-media-'));
// Interpolate at the original resolution; do not fabricate spatial detail.
const flow = 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=hexbs:mb_size=16:search_param=32:vsbmc=1:scd=fdiff:scd_threshold=10';
const jobs = [
  { name: 'home-hero', factor: 1.8, frames: 330, gop: 30 },
  { name: 'catalog-intro', factor: 1, frames: 183, gop: 3 },
];
const encode = job => new Promise((resolve, reject) => {
  console.log(`Preparing ${job.name}: 60 fps, original dimensions.`);
  const process = spawn('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', path.join(root, 'public/videos', `${job.name}-source.mp4`), '-an',
    '-vf', `tpad=stop_mode=clone:stop_duration=0.15,setpts=${job.factor}*(PTS-STARTPTS),${flow}`,
    '-frames:v', String(job.frames), '-c:v', 'libx264', '-preset', 'medium', '-crf', '14',
    '-pix_fmt', 'yuv420p', '-threads', '2', '-filter_threads', '2',
    '-g', String(job.gop), '-keyint_min', String(job.gop), '-sc_threshold', '0',
    '-bf', '0', '-movflags', '+faststart', path.join(temporary, `${job.name}.mp4`),
  ], { stdio: ['ignore', 'inherit', 'inherit'] });
  process.on('error', reject);
  process.on('exit', code => code === 0 ? resolve() : reject(new Error(`${job.name}: FFmpeg exited ${code}`)));
});

try {
  const results = await Promise.allSettled(jobs.map(encode));
  const failed = results.filter(result => result.status === 'rejected');
  if (failed.length) throw new AggregateError(failed.map(result => result.reason), 'Video preparation failed.');
  for (const { name } of jobs) {
    await rename(path.join(temporary, `${name}.mp4`), path.join(root, 'public/videos', `${name}.mp4`));
  }
  console.log('Home and catalog videos refreshed at 60 fps.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
