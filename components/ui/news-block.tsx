'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

interface NewsItem {
  date: string; // ISO yyyy-mm-dd
  title: string;
  excerpt?: string;
  href: string;
}

// href points to the original articles; replace with RAMCAD URLs after migration.
const NEWS: NewsItem[] = [
  {
    date: '2024-03-06',
    title: 'RAMCAD стал партнёром мероприятия «Недвижимый квиз»',
    excerpt: 'Интеллектуальный вечер, который объединил бизнес, партнёров и активную аудиторию. Бренд MARZO принял участие…',
    href: 'https://icechr.ru/2024/03/06/estate-quiz/',
  },
  {
    date: '2024-02-29',
    title: 'Marzo и Lancman School провели уютный вечер кинопросмотра',
    href: 'https://icechr.ru/2024/02/29/marzo-and-lancman/',
  },
  {
    date: '2024-02-18',
    title: 'Новый вкус под брендом Marzo: фруктовый лёд со вкусом дыни',
    excerpt: 'Фабрика мороженого RAMCAD выпустила новый летний вкус под брендом Marzo — фруктовый лёд со вкусом дыни…',
    href: 'https://icechr.ru/2024/02/18/new-icecream/',
  },
  {
    date: '2024-02-02',
    title: 'В ЧР производят более 70 наименований мороженого',
    excerpt: 'С началом лета во всем мире началась пора холодных напитков и мороженого. Чеченская Республика не исключение…',
    href: 'https://icechr.ru/2024/02/02/what-breeds-can-i-choose-for-organic-dairy-farming/',
  },
];

// Fixed locale and UTC keep server and client output identical.
const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('ru-RU', { ...o, timeZone: 'UTC' });
  return {
    day: part({ day: '2-digit' }),
    month: part({ month: 'short' }).replace('.', ''),
    year: part({ year: 'numeric' }),
  };
};

export const NewsBlock: React.FC<{ className?: string }> = ({ className }) => (
  <section id='news' className={cn('section-light scroll-mt-20 py-20 md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <Reveal>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>Новости</p>
        <h2 className='mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl'>
          Холодное производство. Горячие новости.
        </h2>
      </Reveal>

      <div className='mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {NEWS.map((n, i) => {
          const { day, month, year } = formatDate(n.date);
          return (
            <Reveal key={n.href} delay={i * 0.08} className='h-full'>
              <article className='group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-secondary focus-within:ring-2 focus-within:ring-ring'>
                <time
                  dateTime={n.date}
                  className='flex w-fit items-baseline gap-1.5 rounded-full bg-primary px-4 py-1.5 text-primary-foreground'
                >
                  <span className='font-display text-xl font-bold leading-none'>{day}</span>
                  <span className='text-xs uppercase tracking-wider'>
                    {month} {year}
                  </span>
                </time>
                <h3 className='mt-5 line-clamp-4 font-display text-xl font-bold leading-snug tracking-tight'>{n.title}</h3>
                {n.excerpt && (
                  <p className='mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground'>{n.excerpt}</p>
                )}
                <a
                  href={n.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none'
                >
                  Читать
                  <ArrowUpRight
                    aria-hidden
                    className='size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                  />
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
