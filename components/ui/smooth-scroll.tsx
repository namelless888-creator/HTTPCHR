'use client';

import React, { forwardRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ui/contact-form';
import { MapAnimation } from '@/components/ui/map-animation';
import { cn } from '@/lib/utils';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const ROUTE_URL = `https://yandex.ru/maps/?text=${encodeURIComponent('Гудермес, 5-й км трассы Ростов-Баку')}`;

const FOOTER_LINKS = [
  { label: 'Каталог', href: '#catalog' },
  { label: 'Рыба', href: '#fish' },
  { label: 'Полуфабрикаты', href: '#ready-to-eat' },
  { label: 'О компании', href: '#about' },
  { label: 'Новости', href: '#news' },
];

// Grid overlay from the original component, recolored to the palette.
const Grid = ({ line }: { line: string }) => (
  <div
    aria-hidden
    className='pointer-events-none absolute inset-0 bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'
    style={{
      backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    }}
  />
);

const ContactRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <li className='flex gap-4'>
    <span className='grid size-11 shrink-0 place-content-center rounded-full bg-primary text-primary-foreground'>
      <Icon aria-hidden className='size-5' />
    </span>
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='text-lg font-medium'>{children}</p>
    </div>
  </li>
);

// Must live inside <ReactLenis> to reach the instance.
const BackToTop = () => {
  const lenis = useLenis();
  return (
    <button
      type='button'
      onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))}
      className='inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      Наверх
      <ArrowUp aria-hidden className='size-4' />
    </button>
  );
};

export const ContactsBlock = forwardRef<HTMLDivElement>((_props, ref) => {
  const reduce = useReducedMotion();

  return (
    <ReactLenis root options={{ smoothWheel: !reduce, anchors: !reduce }}>
      <div id='contacts' ref={ref} className='scroll-mt-20'>
        {/* Layer 1: deepfreeze dark */}
        <section className='stack-layer grid place-content-center bg-background px-4 py-24 text-center text-foreground'>
          <Grid line='#F1F6F814' />
          <p className='relative text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground'>Контакты</p>
          <h2 className='relative mt-4 px-4 font-display text-5xl font-semibold leading-[120%] tracking-tight 2xl:text-7xl'>
            Где нас найти
          </h2>
          <p className='relative mx-auto mt-6 max-w-xl text-lg text-muted-foreground'>
            Гудермес, 5-й км трассы Ростов–Баку. Листайте вниз: покажем дорогу.
          </p>
          <ArrowDown aria-hidden className='relative mx-auto mt-10 size-6 animate-bounce motion-reduce:animate-none' />
        </section>

        {/* Layer 2: frost light, rounded top, contacts + map animation */}
        <section className='stack-layer section-light flex items-center overflow-hidden rounded-t-3xl px-4 py-20 md:px-8'>
          <Grid line='#0D1B221F' />
          <div className='relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center'>
            <div>
              <h3 className='font-display text-3xl font-bold tracking-tight md:text-4xl'>Мы на трассе Ростов–Баку</h3>
              <ul className='mt-8 space-y-5'>
                <ContactRow icon={MapPin} label='Адрес'>
                  ЧР, г. Гудермес, 5-й км трассы Ростов–Баку
                </ContactRow>
                <ContactRow icon={Phone} label='Телефон'>
                  <a href='tel:+79389042323' className={cn('rounded-sm underline-offset-4 hover:underline', focusRing)}>
                    +7 (938) 904-23-23
                  </a>
                </ContactRow>
                <ContactRow icon={Mail} label='E-mail'>
                  <a href='mailto:oooiceberg95@mail.ru' className={cn('rounded-sm underline-offset-4 hover:underline', focusRing)}>
                    oooiceberg95@mail.ru
                  </a>
                </ContactRow>
                <ContactRow icon={Clock} label='Режим работы'>
                  Пн–Сб 8:00–18:00, воскресенье — выходной
                </ContactRow>
              </ul>
            </div>
            <MapAnimation
              src='/videos/karta_animation.mp4'
              label='Анимация карты: как доехать до RAMCAD по трассе Ростов–Баку в Гудермесе'
            />
          </div>
        </section>

        {/* Layer 3: steel accent, request form + footer */}
        <section className='stack-layer flex flex-col justify-between bg-card px-4 pb-8 pt-24 text-card-foreground md:px-8'>
          <Grid line='#F1F6F814' />
          <div className='relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2'>
            <div>
              <h3 className='font-display text-4xl font-bold tracking-tight md:text-6xl'>Узнать оптовую цену</h3>
              <p className='mt-4 max-w-md text-muted-foreground'>
                Оставьте заявку, и менеджер свяжется с вами в рабочее время: Пн–Сб, 8:00–18:00.
              </p>
              <a
                href={ROUTE_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-semibold transition-colors hover:bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                <MapPin aria-hidden className='size-4' />
                Проложить маршрут
              </a>
            </div>
            <ContactForm />
          </div>

          <footer className='relative mx-auto mt-12 flex w-full max-w-7xl flex-col gap-4 border-t border-border pt-6 text-sm md:flex-row md:items-center md:justify-between'>
            <span className='text-base font-extrabold uppercase tracking-[0.18em]'>RAMCAD</span>
            <nav aria-label='Нижнее меню' className='flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground'>
              {FOOTER_LINKS.map((l) => (
                <a key={l.href} href={l.href} className={cn('rounded-sm transition-colors hover:text-foreground', focusRing)}>
                  {l.label}
                </a>
              ))}
            </nav>
            <div className='flex items-center gap-4'>
              <span className='text-muted-foreground'>© {new Date().getFullYear()} RAMCAD</span>
              <BackToTop />
            </div>
          </footer>
        </section>
      </div>
    </ReactLenis>
  );
});

ContactsBlock.displayName = 'ContactsBlock';
