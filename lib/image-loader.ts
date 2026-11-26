import { BASE_PATH } from './site';

/**
 * `next/image` does not add `basePath` to files from the public folder.
 * Preview deployments live under a sub-path, so every local image goes
 * through this loader; external and inline sources stay untouched.
 */
export default function imageLoader({ src }: { src: string }) {
  if (/^(https?:|data:|blob:)/.test(src) || src.startsWith(BASE_PATH)) return src;
  return `${BASE_PATH}${src.startsWith('/') ? src : `/${src}`}`;
}
