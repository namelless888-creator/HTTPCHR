'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkItem {
  label: string;
  href: string;
}

interface HeroBrandProps {
  name: string;
  eyebrow: string;
  headline: string;
  points: string[];
  primary: LinkItem;
  secondary: LinkItem;
  bgSrc: string;
  bgAlt?: string;
  className?: string;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const HeroBrand: React.FC<HeroBrandProps> = ({
  name,
  eyebrow,
  headline,
  points,
  primary,
  secondary,
  bgSrc,
  bgAlt = '',
  className,
}) => {
  const reduce = useReducedMotion();
  const fade = (delay = 0): MotionProps => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      id='hero'
      className={cn(
        'relative isolate flex min-h-[100svh] scroll-mt-20 flex-col items-center justify-center overflow-hidden bg-background px-4 pb-24 pt-28 text-center text-foreground',
        className
      )}
    >
      <Image src={bgSrc} alt={bgAlt} fill priority sizes='100vw' className='-z-20 object-cover' />
      <div aria-hidden className='absolute inset-0 -z-10 bg-gradient-to-b from-[#0D1B22]/70 via-[#0D1B22]/55 to-[#0D1B22]' />
      <div aria-hidden className='absolute inset-0 -z-10 bg-[#3E6E85]/25 mix-blend-multiply' />

      <motion.p
        {...fade(0)}
        className='mb-6 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm'
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        {...fade(0.1)}
        className='font-sans text-[clamp(3.5rem,14vw,11rem)] font-extrabold uppercase leading-none tracking-[0.18em]'
      >
        {name}
      </motion.h1>

      <motion.p {...fade(0.25)} className='mt-6 max-w-2xl font-display text-2xl tracking-tight md:text-4xl'>
        {headline}
      </motion.p>

      <motion.ul
        {...fade(0.4)}
        className='mt-8 flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-0 md:divide-x md:divide-border'
      >
        {points.map((p) => (
          <li key={p} className='px-6'>
            {p}
          </li>
        ))}
      </motion.ul>

      <motion.div {...fade(0.55)} className='mt-10 flex flex-wrap justify-center gap-3'>
        <Link
          href={primary.href}
          className={cn('rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105', focusRing)}
        >
          {primary.label}
        </Link>
        <Link
          href={secondary.href}
          className={cn('rounded-full border border-foreground/40 px-8 py-3 font-semibold transition-colors hover:bg-card', focusRing)}
        >
          {secondary.label}
        </Link>
      </motion.div>

      <Link href={primary.href} aria-label='Прокрутить вниз' className={cn('absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2', focusRing)}>
        <ChevronDown className={cn('size-6 text-muted-foreground', !reduce && 'animate-bounce')} />
      </Link>
    </section>
  );
};
