'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

export const ExtrasBlock: React.FC<{ className?: string }> = ({ className }) => (
  <section id='extras' className={cn('section-light scroll-mt-20 py-20 md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <Reveal>
        <article id='ready-to-eat' className='flex min-h-56 scroll-mt-20 flex-col justify-between rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:flex-row sm:items-center'>
          <div className='flex items-start gap-4 sm:items-center'>
            <span className='grid size-12 shrink-0 place-content-center rounded-full bg-card'>
              <ChefHat aria-hidden className='size-6' />
            </span>
            <div>
              <h2 className='font-display text-2xl font-bold tracking-tight'>Полуфабрикаты</h2>
              <p className='mt-2 text-muted-foreground'>Каталог полуфабрикатов скоро пополнится.</p>
            </div>
          </div>
          <span className='mt-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground sm:mt-0'>
            Скоро
          </span>
        </article>
      </Reveal>
    </div>
  </section>
);
