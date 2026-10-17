'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { MagicCard } from '@/components/ui/magic-card';
import { CATALOG } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export const CatalogGrid: React.FC<{ className?: string }> = ({ className }) => (
  <section id='catalog-grid' className={cn('section-light scroll-mt-20 py-20 md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <p className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>Весь ассортимент</p>
      <h2 className='mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl'>
        {CATALOG.length} позиций в каталоге
      </h2>
      <p className='mt-5 max-w-2xl text-base text-muted-foreground md:text-lg'>
        Фирменная линейка MARZO и смежные бренды: эскимо, рожки, стаканчики, фруктовый лёд и семейные брикеты.
        Цены и условия поставки — по запросу.
      </p>

      <div className='mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
        {CATALOG.map((item, i) => (
          <Reveal key={item.src} delay={Math.min(i * 0.03, 0.3)} className='h-full'>
            <MagicCard isLight gradientSize={160} gradientOpacity={0.3} className='group flex h-full flex-col'>
              <div className='relative aspect-[3/4] overflow-hidden'>
                <img
                  src={item.src}
                  alt={item.name}
                  loading='lazy'
                  decoding='async'
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {item.hot && (
                  <span className='absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground'>
                    Хит
                  </span>
                )}
              </div>
              <p className='px-3 py-3 text-sm leading-snug'>{item.name}</p>
            </MagicCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
