'use client';

import React from 'react';
import Link from 'next/link';
import { FlaskConical, IceCreamCone, Quote, Snowflake, UtensilsCrossed } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const ADVANTAGES = [
  { icon: Snowflake, title: 'Передовой хладокомбинат', text: 'Высокоточное оборудование, полная автоматизация холода, цифровой контроль температуры, надёжность.' },
  { icon: FlaskConical, title: 'Исследования и разработки', text: 'Изучаем свойства сырья, тестируем технологии, улучшаем процессы и стандарты качества.' },
  { icon: IceCreamCone, title: 'Линейка продукции', text: 'Разнообразие решений, единый стандарт качества, проверенный временем и людьми.' },
  { icon: UtensilsCrossed, title: 'Всегда на столе', text: 'Продукты, которые покупают снова и снова. Ежедневно. Для всей семьи. Во всех городах.' },
];

const QUALITY = [
  'Молоко с паспортом качества и цифровым кодом',
  'Рыбная продукция с уникальными идентификационными номерами',
  'Элитное зерно с 60-летней историей селекции',
];

const STATS = [
  { value: '2003', label: 'год основания' },
  { value: '3', label: 'отдельных цеха' },
];

export const AboutBlock: React.FC<{ className?: string }> = ({ className }) => (
  <section id='about' className={cn('section-light scroll-mt-20 py-20 md:py-28', className)}>
    <div className='mx-auto max-w-7xl px-4 md:px-8'>
      <Reveal>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>О компании</p>
        <h2 className='mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl'>
          Главное звено холодовой цепи Чеченской Республики
        </h2>
      </Reveal>

      <div className='mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]'>
        <Reveal className='space-y-5 text-base leading-relaxed md:text-lg'>
          <p className='text-xl leading-snug md:text-2xl'>
            RAMCAD — один из ведущих производителей продуктов питания в Чеченской Республике. Предприятие с богатой историей и безупречной репутацией надёжного поставщика.
          </p>
          <p>
            На производстве работают три отдельных цеха: цех мороженого, цех рыбы и цех полуфабрикатов. Для каждого из них предусмотрены свои отдельные холодильники с точным климат-контролем. Современное оборудование позволяет задавать уникальные параметры температуры и влажности под каждый вид продукции. Это полностью исключает смешение запахов и гарантирует идеальную свежесть.
          </p>
          <p>
            Процесс заморозки, хранения и созревания продукции в оборудованных камерах с постоянной температурой и влажностью занимает от нескольких часов до нескольких месяцев. Для мороженого нужен экстремальный холод, для рыбы — щадящий режим, а для полуфабрикатов — стабильная минусовая температура. Это настоящее царство холода, где безупречное качество сохраняется на каждом этапе.
          </p>
        </Reveal>

        <Reveal delay={0.1} className='space-y-6'>
          <figure className='rounded-2xl bg-primary p-8 text-primary-foreground'>
            <Quote aria-hidden className='size-8 opacity-60' />
            <blockquote className='mt-4 font-display text-xl leading-snug md:text-2xl'>
              «Используя многолетнюю операционную экспертизу и строгий контроль цепочки поставок натурального сырья, мы гарантируем стабильно высокое качество всей нашей продукции.»
            </blockquote>
            <figcaption className='mt-6 flex items-center gap-3'>
              <span aria-hidden className='grid size-12 place-content-center rounded-full bg-primary-foreground font-semibold text-primary'>МШ</span>
              <span>
                <span className='block font-semibold'>Муса Шаванов</span>
                <span className='text-sm opacity-80'>Генеральный директор</span>
              </span>
            </figcaption>
          </figure>

          <dl className='grid grid-cols-2 gap-4'>
            {STATS.map((s) => (
              <div key={s.label} className='flex flex-col-reverse rounded-2xl border border-border p-5'>
                <dt className='mt-1 text-sm text-muted-foreground'>{s.label}</dt>
                <dd className='font-display text-4xl font-bold'>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className='mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {ADVANTAGES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08} className='h-full'>
            <article className='h-full rounded-2xl border border-border bg-card p-6'>
              <span className='grid size-11 place-content-center rounded-full bg-primary text-primary-foreground'>
                <Icon aria-hidden className='size-5' />
              </span>
              <h3 className='mt-5 font-display text-xl font-bold tracking-tight'>{title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className='mt-16'>
        <div className='grid gap-8 rounded-3xl bg-primary p-8 text-primary-foreground md:grid-cols-2 md:p-12'>
          <div>
            <h3 className='font-display text-2xl font-bold tracking-tight md:text-3xl'>Контроль качества от сырья до прилавка</h3>
            <ul className='mt-5 space-y-3'>
              {QUALITY.map((q) => (
                <li key={q} className='flex gap-3'>
                  <span aria-hidden className='mt-2 size-1.5 shrink-0 rounded-full bg-primary-foreground' />
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col items-start justify-center gap-4 md:items-end md:text-right'>
            <p className='font-display text-2xl font-bold'>Приглашаем к сотрудничеству!</p>
            <p className='opacity-80'>Организуем экскурсии по производству.</p>
            <Link
              href='/contacts'
              className='rounded-full bg-primary-foreground px-8 py-3 font-semibold text-primary transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
            >
              Договориться об экскурсии
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
