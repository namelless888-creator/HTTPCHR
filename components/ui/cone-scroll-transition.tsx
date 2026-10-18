'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { CONE_MASK, CONE_SILHOUETTE, mountConeScrollTransition } from '@/lib/cone-scroll-transition.mjs';

/** The supplied expanding silhouette transition, adapted to a waffle cone. */
export function ConeScrollTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => mountConeScrollTransition(ref.current, CONE_MASK), []);
  return <div ref={ref} className='cone-transition'>
    <div className='cone-pin'>
      <div className='cone-window'>{children}</div>
      <svg className='cone-illustration' viewBox='0 0 200 300' aria-hidden='true' focusable='false'>
        <defs>
          <linearGradient id='cone-cream' x1='0' y1='0' x2='1' y2='1'><stop stopColor='#fffdf0' /><stop offset='.5' stopColor='#f5e5c2' /><stop offset='1' stopColor='#d6b585' /></linearGradient>
          <linearGradient id='cone-waffle' x1='0' y1='0' x2='1' y2='0'><stop stopColor='#b87d40' /><stop offset='.45' stopColor='#e4b578' /><stop offset='1' stopColor='#b98349' /></linearGradient>
          <pattern id='cone-grid' width='16' height='16' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><path d='M0 0H16V16H0Z' fill='none' stroke='#9c642d' strokeWidth='1.2' opacity='.55' /></pattern>
          <clipPath id='cone-outline'><path d={CONE_SILHOUETTE} /></clipPath>
        </defs>
        <g clipPath='url(#cone-outline)'>
          <path d={CONE_SILHOUETTE} fill='url(#cone-cream)' />
          <path d='M38 137H162L100 302Z' fill='url(#cone-waffle)' />
          <path d='M38 137H162L100 302Z' fill='url(#cone-grid)' />
          <path d='M39 137Q100 154 161 137' stroke='#b78043' strokeWidth='4' fill='none' />
          <path d='M48 104C73 114 125 111 152 96M63 69C86 78 122 75 139 62M79 42C96 48 113 48 123 39' fill='none' stroke='#d1b085' strokeWidth='3' strokeLinecap='round' />
          <path d='M44 119C64 130 115 133 147 121M66 87C89 94 121 91 139 84' fill='none' stroke='#fffdf0' strokeWidth='4' strokeLinecap='round' opacity='.85' />
        </g>
        <path d={CONE_SILHOUETTE} fill='none' stroke='#aa7744' strokeWidth='1' opacity='.4' />
      </svg>
    </div>
  </div>;
}
