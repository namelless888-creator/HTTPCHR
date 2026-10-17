'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { Particles } from '@/components/ui/particles';
import { cn } from '@/lib/utils';

interface HeroSplitProps {
  eyebrow: string;
  headline: string[]; // each entry is its own line
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  images: { src: string; alt: string }[]; // right-panel product collage, 2-3 images
  className?: string;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const HeroSplit: React.FC<HeroSplitProps> = ({ eyebrow, headline, cta, secondaryCta, images, className }) => {
  const reduce = useReducedMotion();
  const fade = (delay = 0): MotionProps => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id='hero' className={cn('grid scroll-mt-20 grid-cols-1 pt-16 lg:min-h-[100svh] lg:grid-cols-2', className)}>
      {/* Left: light panel, headline + CTA */}
      <div className='section-light flex flex-col justify-center px-6 py-16 md:px-12 md:pl-64 lg:py-20'>
        <motion.p {...fade(0)} className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
          {eyebrow}
        </motion.p>
        <motion.h1 {...fade(0.1)} className='mt-4 max-w-xl font-display text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl'>
          {headline.map((line, i) => (
            <span key={i} className='block'>
              {line}
            </span>
          ))}
        </motion.h1>
        <motion.div {...fade(0.3)} className='mt-10 flex flex-wrap items-center gap-4'>
          <Link
            href={cta.href}
            className={cn('inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-105', focusRing)}
          >
            {cta.label}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href={secondaryCta.href}
            className={cn('text-sm font-semibold underline-offset-4 hover:underline', focusRing)}
          >
            {secondaryCta.label}
          </Link>
        </motion.div>
      </div>

      {/* Right: dark panel, product collage */}
      <div className='relative flex min-h-[60svh] items-center justify-center overflow-hidden bg-background px-6 py-16 lg:min-h-0 lg:py-20'>
        <div aria-hidden className='absolute inset-0 bg-gradient-to-t from-[#0D1B22] via-transparent to-transparent' />
        <Particles className='absolute inset-0' quantity={70} staticity={40} color='#F1F6F8' />
        <div className='relative flex items-end gap-3 sm:gap-5'>
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ rotate: i === 1 ? 0 : i === 0 ? -6 : 6 }}
              className={cn(
                'relative w-28 shrink-0 overflow-hidden rounded-2xl border border-border shadow-2xl sm:w-36 md:w-44',
                i === 1 && 'z-10 w-36 sm:w-44 md:w-56'
              )}
            >
              <Image src={img.src} alt={img.alt} width={400} height={533} className='h-full w-full object-cover' />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
