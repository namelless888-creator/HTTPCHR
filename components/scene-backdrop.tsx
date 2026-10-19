import Image from 'next/image';

export function SceneBackdrop({ priority = false }: { priority?: boolean }) {
  return <span className='scene-backdrop' aria-hidden='true'>
    <Image src='/images/studio-background.webp' alt='' width={1672} height={941} unoptimized loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
  </span>;
}
