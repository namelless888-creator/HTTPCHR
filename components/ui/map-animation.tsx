'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapAnimationProps {
  src: string;
  label: string;
  className?: string;
}

// Plays the 14 s map animation once, when it is at least half visible, then holds the last frame.
export const MapAnimation: React.FC<MapAnimationProps> = ({ src, label, className }) => {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduce) {
      // Reduced motion: no autoplay, show the finished map.
      const showLastFrame = () => {
        video.currentTime = Math.max(video.duration - 0.05, 0);
        setFinished(true);
      };
      if (video.readyState >= 1) showLastFrame();
      else video.addEventListener('loadedmetadata', showLastFrame, { once: true });
      return () => video.removeEventListener('loadedmetadata', showLastFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          video.play().catch(() => setFinished(true));
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setFinished(false);
    video.play().catch(() => setFinished(true));
  }, []);

  return (
    <figure className={cn('relative', className)}>
      <div className='relative aspect-video overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl ring-1 ring-primary/20'>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload='metadata'
          aria-label={label}
          onEnded={() => setFinished(true)}
          className='h-full w-full object-cover'
        />
        <button
          type='button'
          onClick={replay}
          tabIndex={finished ? 0 : -1}
          aria-label='Повторить анимацию карты'
          className={cn(
            'absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            finished ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <RotateCcw aria-hidden className='size-4' />
          Повторить
        </button>
      </div>
      <figcaption className='mt-3 text-sm text-muted-foreground'>Гудермес, 5-й км трассы Ростов–Баку</figcaption>
    </figure>
  );
};
