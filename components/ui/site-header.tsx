'use client';

import React from 'react';
import { Menu, Phone } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const LINKS = [
  { label: 'Главная', href: '#hero' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'О компании', href: '#about' },
  { label: 'Новости', href: '#news' },
  { label: 'Контакты', href: '#contacts' },
];

export const SiteHeader: React.FC = () => (
  <header className='fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-background/80 text-foreground backdrop-blur'>
    <div className='mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8'>
      <a href='#hero' className={cn('rounded-sm text-lg font-extrabold uppercase tracking-[0.18em]', focusRing)}>
        RAMCAD
      </a>

      <nav aria-label='Главное меню' className='hidden items-center gap-8 md:flex'>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={cn('rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground', focusRing)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className='flex items-center gap-3'>
        <a href='tel:+79389042323' className={cn('hidden items-center gap-2 rounded-sm text-sm font-semibold lg:inline-flex', focusRing)}>
          <Phone aria-hidden className='size-4' />
          +7 (938) 904-23-23
        </a>
        <Sheet>
          <SheetTrigger asChild>
            <button
              type='button'
              aria-label='Открыть меню'
              className={cn('grid size-10 place-content-center rounded-full border border-border md:hidden', focusRing)}
            >
              <Menu aria-hidden className='size-5' />
            </button>
          </SheetTrigger>
          <SheetContent side='right' className='bg-background text-foreground'>
            <SheetHeader>
              <SheetTitle className='font-extrabold uppercase tracking-[0.18em]'>RAMCAD</SheetTitle>
            </SheetHeader>
            <nav aria-label='Мобильное меню' className='mt-8 flex flex-col gap-5 px-4'>
              {LINKS.map((l) => (
                <SheetClose asChild key={l.href}>
                  <a href={l.href} className={cn('rounded-sm font-display text-2xl', focusRing)}>
                    {l.label}
                  </a>
                </SheetClose>
              ))}
              <a href='tel:+79389042323' className={cn('mt-4 inline-flex items-center gap-2 rounded-sm font-semibold', focusRing)}>
                <Phone aria-hidden className='size-4' />
                +7 (938) 904-23-23
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
);
