'use client';

import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, type Variants } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CatalogItem {
  src: string;
  name: string;
  hot?: boolean;
}

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  items: CatalogItem[];
  speed?: number; // px per second
  className?: string;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card';

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const ActionButton = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      'mt-8 inline-block rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90',
      focusRing
    )}
  >
    {children}
  </motion.a>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  items,
  speed = 60,
  className,
}) => {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Seamless loop: the track holds two identical halves; wrap x after one half.
  useAnimationFrame((_, delta) => {
    if (reduce || paused || hovered || !trackRef.current) return;
    const half = trackRef.current.scrollWidth / 2;
    let next = x.get() - (speed * Math.min(delta, 64)) / 1000;
    if (next <= -half) next += half;
    x.set(next);
  });

  const list = reduce ? items : [...items, ...items];
  const initial = reduce ? false : 'hidden';

  return (
    <section
      id='catalog'
      className={cn(
        'relative flex min-h-[100svh] w-full scroll-mt-20 flex-col items-center justify-center overflow-hidden bg-card px-4 pb-[36svh] pt-24 text-center text-card-foreground md:pb-[40svh]',
        className
      )}
    >
      <div className='z-10 flex flex-col items-center'>
        <motion.div
          initial={initial}
          animate='show'
          variants={FADE_IN_ANIMATION_VARIANTS}
          className='mb-4 inline-block rounded-full border border-border bg-background/40 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm'
        >
          {tagline}
        </motion.div>

        <motion.h2
          initial={initial}
          animate='show'
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className='font-display text-4xl font-bold tracking-tighter md:text-7xl'
        >
          {typeof title === 'string'
            ? title.split(' ').map((word, i) => (
                <motion.span key={i} variants={FADE_IN_ANIMATION_VARIANTS} className='inline-block'>
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h2>

        <motion.p
          initial={initial}
          animate='show'
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className='mt-6 max-w-xl text-base text-muted-foreground md:text-lg'
        >
          {description}
        </motion.p>

        <motion.div
          initial={initial}
          animate='show'
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
          className='flex flex-col items-center'
        >
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
          {!reduce && (
            <button
              type='button'
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? 'Запустить прокрутку каталога' : 'Остановить прокрутку каталога'}
              className={cn(
                'mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
                focusRing
              )}
            >
              {paused ? <Play className='size-4' /> : <Pause className='size-4' />}
              {paused ? 'Пуск' : 'Пауза'}
            </button>
          )}
        </motion.div>
      </div>

      {/* Animated catalog marquee */}
      <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className={cn(
          'absolute bottom-0 left-0 h-[34svh] w-full md:h-[40svh] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]',
          reduce && 'overflow-x-auto'
        )}
      >
        <motion.div ref={trackRef} style={{ x }} className='flex w-max gap-4 py-6'>
          {list.map((item, index) => {
            const isClone = !reduce && index >= items.length;
            return (
              <figure
                key={index}
                aria-hidden={isClone || undefined}
                className='w-36 shrink-0 text-left md:w-48'
                style={{ rotate: `${(index % items.length) % 2 === 0 ? -2 : 5}deg` }}
              >
                <div className='relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-background shadow-md'>
                  <img
                    src={item.src}
                    alt={isClone ? '' : item.name}
                    loading='lazy'
                    decoding='async'
                    className='h-full w-full object-cover'
                  />
                  {item.hot && (
                    <span className='absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground'>
                      Хит
                    </span>
                  )}
                </div>
                <figcaption className='mt-2 line-clamp-2 px-1 text-xs leading-snug md:text-sm'>{item.name}</figcaption>
              </figure>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
