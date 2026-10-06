'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const FOOTER_LINKS = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Рыба', href: '/#fish' },
  { label: 'Полуфабрикаты', href: '/#ready-to-eat' },
  { label: 'О компании', href: '/#about' },
  { label: 'Новости', href: '/news' },
];

export const SiteFooter: React.FC = () => (
  <footer className='border-t border-border bg-background px-4 py-8 text-foreground md:px-8'>
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between'>
      <span className='text-base font-extrabold uppercase tracking-[0.18em]'>RAMCAD</span>
      <nav aria-label='Нижнее меню' className='flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground'>
        {FOOTER_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={cn('rounded-sm transition-colors hover:text-foreground', focusRing)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className='flex items-center gap-4'>
        <span className='text-muted-foreground'>© {new Date().getFullYear()} RAMCAD</span>
        <button
          type='button'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-card',
            focusRing
          )}
        >
          Наверх
          <ArrowUp aria-hidden className='size-4' />
        </button>
      </div>
    </div>
  </footer>
);
