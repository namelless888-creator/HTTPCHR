'use client';

import React from 'react';
import { ArrowUpRight, ChefHat } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card';

export const ExtrasBlock: React.FC<{ className?: string }> = ({ className }) => (
  <section id='extras' className={cn('scroll-mt-20 bg-background py-20 text-foreground md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <Reveal>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>Дополнительные товары</p>
        <h2 className='mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl'>
          Стабильные поставки холодной продукции
        </h2>
        <p className='mt-5 max-w-2xl text-base text-muted-foreground md:text-lg'>
          Рыба и полуфабрикаты идут по той же холодовой цепи: отдельные камеры, точный контроль температуры и влажности.
        </p>
      </Reveal>

      <div className='mt-12 grid gap-6 md:grid-cols-2'>
        <Reveal className='h-full'>
          <article id='fish' className='group flex h-full scroll-mt-20 flex-col overflow-hidden rounded-2xl border border-border bg-card'>
            <div className='aspect-[4/3] overflow-hidden'>
              <img
                src='/images/extras/seld-file.jpg'
                alt='Сельдь филе в масле с пряностями'
                loading='lazy'
                decoding='async'
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </div>
            <div className='flex flex-1 flex-col items-start gap-3 p-6'>
              <span className='rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Рыба
              </span>
              <h3 className='font-display text-2xl font-bold tracking-tight'>Сельдь филе в масле с пряностями</h3>
              <a
                href='#contacts'
                className={cn(
                  'mt-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground',
                  focusRing
                )}
              >
                Узнать оптовую цену
                <ArrowUpRight aria-hidden className='size-4' />
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.1} className='h-full'>
          <article
            id='ready-to-eat'
            className='flex h-full min-h-72 scroll-mt-20 flex-col justify-between rounded-2xl border border-dashed border-border bg-card/40 p-8'
          >
            <div className='flex items-start justify-between'>
              <span className='grid size-12 place-content-center rounded-full bg-card'>
                <ChefHat aria-hidden className='size-6' />
              </span>
              <span className='rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground'>Скоро</span>
            </div>
            <div>
              <h3 className='font-display text-2xl font-bold tracking-tight'>Полуфабрикаты</h3>
              <p className='mt-2 text-muted-foreground'>Каталог полуфабрикатов скоро пополнится.</p>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  </section>
);
