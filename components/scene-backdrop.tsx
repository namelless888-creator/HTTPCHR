import Image from 'next/image';

export function SceneBackdrop({ priority = false, src = '/images/studio-background.webp' }: { priority?: boolean; src?: string }) {
  return <span className='scene-backdrop' aria-hidden='true'>
    <Image src={src} alt='' width={1672} height={941} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
  </span>;
}
