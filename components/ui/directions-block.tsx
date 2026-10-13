'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Handshake } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

interface Direction {
  id?: string;
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
}

const DIRECTIONS: Direction[] = [
  {
    tag: 'Мороженое',
    title: 'Мороженое',
    description: 'Натуральные ингредиенты в традиционных рецептах с 2003 года.',
    ctaLabel: 'Смотреть продукцию',
    href: '/catalog',
    image: '/images/catalog/11.jpg',
    imageAlt: 'MARZO шоколадное эскимо',
  },
  {
    id: 'fish',
    tag: 'Рыба и морепродукты',
    title: 'Рыба и морепродукты',
    description: 'Надёжные поставки для вашей сети.',
    ctaLabel: 'Узнать оптовую цену',
    href: '/contacts',
    image: '/images/extras/seld-file.jpg',
    imageAlt: 'Сельдь филе в масле с пряностями',
  },
];

export const DirectionsBlock: React.FC<{ className?: string }> = ({ className }) => (
  <section className={cn('bg-background py-20 text-foreground md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <Reveal>
        <h2 className='max-w-3xl font-display text-3xl font-bold tracking-tight md:text-5xl'>
          Несколько направлений — один стандарт качества
        </h2>
      </Reveal>

      <div className='mt-10 grid gap-6 md:grid-cols-2'>
        {DIRECTIONS.map((d, i) => (
          <Reveal key={d.title} delay={i * 0.1} className='h-full'>
            <article id={d.id} className='group relative flex h-full min-h-80 scroll-mt-20 flex-col justify-end overflow-hidden rounded-2xl border border-border'>
              <img
                src={d.image}
                alt={d.imageAlt}
                loading='lazy'
                decoding='async'
                className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div aria-hidden className='absolute inset-0 bg-gradient-to-t from-[#0D1B22]/90 via-[#0D1B22]/30 to-transparent' />
              <div className='relative p-6 text-[#F1F6F8] md:p-8'>
                <h3 className='font-display text-2xl font-bold tracking-tight md:text-3xl'>{d.title}</h3>
                <p className='mt-2 max-w-sm text-sm text-[#F1F6F8]/80 md:text-base'>{d.description}</p>
                <Link
                  href={d.href}
                  className={cn(
                    'mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold underline-offset-4 hover:underline',
                    focusRing
                  )}
                >
                  {d.ctaLabel}
                  <ArrowUpRight aria-hidden className='size-4' />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className='mt-6'>
        <div className='flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-5 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-4'>
            <span className='grid size-11 shrink-0 place-content-center rounded-full bg-primary text-primary-foreground'>
              <Handshake aria-hidden className='size-5' />
            </span>
            <div>
              <p className='font-semibold'>Для магазинов, ресторанов и дистрибьюторов</p>
              <p className='text-sm text-muted-foreground'>Стабильные поставки. Гибкие условия. Личный менеджер.</p>
            </div>
          </div>
          <Link
            href='/contacts'
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-105',
              focusRing
            )}
          >
            Сотрудничать
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
