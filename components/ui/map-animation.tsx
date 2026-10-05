'use client';

import React, { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MapAnimationProps {
  src: string;
  label: string;
  /** Ref to the enclosing sticky section; scroll progress through it drives playback. */
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

// Scrubs the map video's currentTime to how far the viewer has scrolled through
// the sticky section it sits behind, so the route "draws" as the page scrolls.
// Under prefers-reduced-motion it just holds the final frame.
export const MapAnimation: React.FC<MapAnimationProps> = ({ src, label, sectionRef, className }) => {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      durationRef.current = video.duration || 0;
      if (reduce) video.currentTime = Math.max(durationRef.current - 0.05, 0);
    };
    if (video.readyState >= 1) onLoaded();
    else video.addEventListener('loadedmetadata', onLoaded, { once: true });
    return () => video.removeEventListener('loadedmetadata', onLoaded);
  }, [reduce]);

  useLenis((lenis) => {
    if (reduce) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    const duration = durationRef.current;
    if (!video || !section || !duration) return;
    // offsetTop/offsetHeight reflect the section's static flow position, unaffected
    // by its own sticky offset, so this stays stable while it's pinned on screen.
    const progress = Math.min(1, Math.max(0, (lenis.scroll - section.offsetTop) / section.offsetHeight));
    video.currentTime = progress * duration;
  });

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload='auto'
      aria-label={label}
      className={cn('h-full w-full object-cover', className)}
    />
  );
};
