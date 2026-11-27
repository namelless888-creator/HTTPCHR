'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Snowflake } from 'lucide-react';

/** A single scroll-linked scene, with no scroll interception. */
export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  return <section ref={ref} className='brand-hero'>
    <motion.div className='brand-hero-ice' style={{ y: reduce ? 0 : y }}>
      <Image src='/images/herring/studio-ice.png' alt='' fill sizes='100vw' priority />
    </motion.div>
    <div className='brand-hero-shade' />
    <div className='brand-hero-copy'>
      <p>RAMKAD · Гудермес · с 2003 года</p>
      <h1><span>О компании.</span><br /><span>Всё начинается</span><br /><span>с холода.</span></h1>
      <div className='brand-hero-bottom'><p>Мороженое MARZO и пресервы «Айсберг».<br />Два направления. Одно внимание к продукту.</p><a href='#about' aria-label='Подробнее о компании'><ArrowDown size={26} aria-hidden /></a></div>
    </div>
    <span className='brand-hero-word' aria-hidden='true'>RAMKAD</span>
  </section>;
}

export function FlavorRibbon() {
  return <div className='flavor-ribbon' aria-hidden='true'><div className='flavor-ribbon-track'>
    {[0, 1].map(copy => <span key={copy}>Пломбир <Snowflake /> Шоколад <Snowflake /> Фисташка <Snowflake /> Дыня <Snowflake /> </span>)}
  </div></div>;
}

export function ManifestoWords() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = 'Чтобы вкус оставался таким, каким его задумали.'.split(' ');
  return <p ref={ref} aria-label={words.join(' ')}>{words.map((word, index) => <ManifestoWord key={index} word={word} index={index} total={words.length} progress={scrollYProgress} reduce={!!reduce} />)}</p>;
}

function ManifestoWord({ word, index, total, progress, reduce }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; reduce: boolean }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [.25, 1]);
  return <motion.span aria-hidden='true' style={{ opacity: reduce ? 1 : opacity }}>{word}{' '}</motion.span>;
}

const FAQ = [
  ['Как обсудить поставки?', 'Оставьте заявку на странице «Контакты» или позвоните +7 (938) 904-23-23. Ассортимент и условия поставки можно обсудить с компанией напрямую.'],
  ['Где находится хладокомбинат?', 'В Чеченской Республике, в Гудермесе, на 5-м километре трассы Ростов–Баку. Контакты и схема проезда — на отдельной странице.'],
  ['Какую продукцию можно посмотреть в каталоге?', 'Мороженое MARZO и «Бурёнка», а также рыбные пресервы «Айсберг». В карточках представлены доступные форматы и описания продукции.'],
  ['С какого года работает компания?', 'История марки мороженого начинается в 2003 году. MARZO продолжает её в обновлённом бренде.'],
];

export function AboutClosing() {
  return <>
    <section className='quality-section section-pad'>
      <div className='quality-heading'><h2>Холод — часть<br />рецепта.</h2><p>Производство и хранение</p></div>
      <div className='quality-layout'>
        <figure><Image src='/images/herring/studio-ice.png' alt='Колотый лёд крупным планом' width={1254} height={1254} /><figcaption>Свой температурный режим для каждого продукта</figcaption></figure>
        <div className='quality-points'>
          <div><h3>Три отдельных цеха</h3><p>Производство с отдельными пространствами для работы с продукцией.</p></div>
          <div><h3>Собственные камеры</h3><p>Холодильное хранение на территории хладокомбината.</p></div>
          <div><h3>Внимание к сырью</h3><p>Молоко поступает от проверенных поставщиков; каждая партия имеет паспорт качества.</p></div>
        </div>
      </div>
    </section>
    <section className='partners-section section-pad'>
      <h2>Для вашего<br />бизнеса.</h2>
      <div><p>Приглашаем к сотрудничеству торговые сети, рестораны, отели, дистрибьюторов и оптовых клиентов.</p><ul><li>Магазины и торговые сети</li><li>Кафе, рестораны и отели</li><li>Оптовые партнёры</li></ul><Link className='text-link' href='/contacts#request'>Обсудить условия поставки <ArrowUpRight size={18} aria-hidden /></Link></div>
    </section>
    <section className='about-faq section-pad'>
      <h2>Частые вопросы</h2>
      <div>{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden='true'>+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </>;
}

export function PartnershipFinal() {
  return <section className='partnership-final section-pad'><Snowflake className='partnership-crystal' aria-hidden /><h2>Начнём<br />с разговора.</h2><div><p>Расскажите о вашем бизнесе.<br />Обсудим ассортимент и поставки.</p><Link className='pill' href='/contacts#request'>Оставить заявку <ArrowUpRight size={20} aria-hidden /></Link></div></section>;
}
