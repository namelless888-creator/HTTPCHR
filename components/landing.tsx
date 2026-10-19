'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Factory, Handshake, Lightbulb, Menu, PackageCheck, Snowflake, UtensilsCrossed, X } from 'lucide-react';
import { CATALOG } from '@/lib/catalog';
import { ProductDetails } from '@/components/product-details';
import { getProduct, PRODUCTS, productCategory as category, productHref } from '@/lib/products';
import { mountMapIntro } from '@/lib/map-intro.mjs';
import { mountHeroParallax } from '@/lib/hero-parallax.mjs';

const NAV = [['home', '/', 'Главная'], ['catalog', '/catalog', 'Каталог'], ['about', '/about', 'О компании'], ['contacts', '/contacts', 'Контакты']] as const;
export type SitePage = typeof NAV[number][0] | 'product';
const MotionLink = motion.create(Link);
const FILTERS = ['Все вкусы', 'Рожки', 'Эскимо', 'Стаканчики', 'Фруктовый лёд', 'Для семьи'];
const flavorCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов'}`;
const NEWS = [
  { date: '06.03.2024', iso: '2024-03-06', type: 'События', title: 'Когда хороший вкус объединяет', text: 'MARZO — партнёр интеллектуального вечера «Недвижимый квиз».', slug: '2024/03/06/estate-quiz/', image: 4 },
  { date: '29.02.2024', iso: '2024-02-29', type: 'Партнёрство', title: 'Кино, друзья и любимое мороженое', text: 'Уютный кинопросмотр вместе с MARZO и Lancman School.', slug: '2024/02/29/marzo-and-lancman/', image: 11 },
  { date: '18.02.2024', iso: '2024-02-18', type: 'Новый вкус', title: 'Маленький кусочек большого лета', text: 'Фруктовый лёд со вкусом дыни в коллекции MARZO.', slug: '2024/02/18/new-icecream/', image: 3 },
];

const ADVANTAGES = [
  { icon: Factory, title: 'Передовой хладокомбинат', text: 'Высокоточное оборудование, полная автоматизация холода, цифровой контроль температуры, надёжность.' },
  { icon: Lightbulb, title: 'Исследования и разработки', text: 'Изучаем свойства сырья, тестируем технологии, улучшаем процессы и стандарты качества.' },
  { icon: PackageCheck, title: 'Линейка продукции', text: 'Разнообразие решений, единый стандарт качества, проверенный временем и людьми.' },
  { icon: UtensilsCrossed, title: 'Всегда на столе', text: 'Продукты, которые покупают снова и снова. Ежедневно. Для всей семьи. Во всех городах.' },
];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

function SectionTitle({ number, children, note }: { number: string; children: React.ReactNode; note?: string }) {
  return <div className='section-kicker'><span>{number} / {children}</span>{note && <span>{note}</span>}</div>;
}

export function Landing({ page = 'home', productId }: { page?: SitePage; productId?: string }) {
  const activePage = page === 'product' ? 'catalog' : page;
  const reduce = useReducedMotion();
  const ContentHeading = page === 'home' ? 'h2' : 'h1';
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Все вкусы');
  const [expanded, setExpanded] = useState(false);
  const map = useRef<HTMLVideoElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => mountHeroParallax(document.getElementById('hero')), [page]);
  useEffect(() => page === 'contacts' ? mountMapIntro(map.current) : undefined, [page]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-ready'); revealObserver.observe(el); });
    return () => revealObserver.disconnect();
  }, [page]);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenu(false); menuToggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);

  useEffect(() => {
    const video = map.current;
    if (!video || page === 'contacts') return;
    let frame = 0;
    let lastTick = 0;
    const sync = () => {
      frame = 0;
      video.pause();
      if (!Number.isFinite(video.duration) || video.seeking) return;
      const rect = video.closest('.contacts-section')!.getBoundingClientRect();
      const viewport = window.innerHeight;
      const headerHeight = document.querySelector('.main-header')!.getBoundingClientRect().height;
      const sectionTop = window.scrollY + rect.top;
      const start = Math.max(0, sectionTop - viewport);
      const naturalEnd = sectionTop + rect.height - headerHeight - .1 * (viewport - headerHeight);
      const maxScroll = document.documentElement.scrollHeight - viewport;
      const end = Math.max(start + 1, Math.min(naturalEnd, maxScroll - 64));
      const progress = reduce ? 1 : Math.min(1, Math.max(0,
        (window.scrollY - start) / (end - start)));
      const target = progress * Math.max(0, video.duration - .05);
      const now = performance.now();
      const elapsed = lastTick ? Math.min(64, now - lastTick) : 16.7;
      lastTick = now;
      const distance = target - video.currentTime;
      if (Math.abs(distance) <= .015) { lastTick = 0; return; }
      const time = reduce || Math.abs(distance) < .04
        ? target : video.currentTime + distance * (1 - Math.exp(-elapsed / 220));
      video.currentTime = time;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('seeked', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('seeked', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduce, page]);

  const products = PRODUCTS.filter(item => filter === 'Все вкусы' || category(item.n) === filter);
  const visible = expanded ? products : products.slice(0, 8);
  const product = productId ? getProduct(productId) : undefined;

  return <div className={`ramcad site-page-${page}`}>
    <motion.div className='reading-progress' style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <header className='main-header'>
      <Link href='/' className='header-brand' aria-label='RAMCAD — на главную'>RAMCAD</Link>
      <nav id='main-navigation' className={menu ? 'header-links is-open' : 'header-links'} aria-label='Основная навигация'>
        {NAV.map(([id, href, label]) => <Link key={id} href={href} className={activePage === id ? 'is-active' : ''} aria-current={activePage === id ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</Link>)}
      </nav>
      <a className='header-phone' href='tel:+79389042323'>8 (938) 904-23-23</a>
      <button ref={menuToggle} className='mobile-toggle header-menu-toggle' aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls='main-navigation' onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </header>

    <div className='page-content'>
      <main id='main'>
        {page === 'home' && <>
          <section id='hero' className='reference-hero'>
          <div className='reference-hero-photo' role='img' aria-label='Мороженое MARZO: солёная карамель, эскимо и шоколадный пломбир на ледяной поверхности'>
            <Image src='/images/hero-reference.png' alt='' width={1536} height={1024} unoptimized priority />
          </div>
          <div className='reference-hero-copy'><h1>Создаём вкус.<br />Сохраняем свежесть.</h1><Link className='pill pill-dark reference-hero-button' href='/catalog'>Смотреть каталог <ArrowRight size={27} /></Link></div>
        </section>

        <section id='directions' className='directions-section section-pad'>
          <Reveal className='direction-heading'>
            <h2>Эксперты в холоде.<br />Мастера вкуса.</h2>
            <p>Производим мороженое.<br />Поставляем рыбу и морепродукты.</p>
          </Reveal>
          <div className='direction-cards'>
            <Reveal>
              <Link href='/catalog' className='direction-card'>
                <div className='direction-photo direction-photo-ice' role='img' aria-label='Вафельный рожок с мороженым и эскимо в шоколадной глазури'>
                  <Image src='/images/directions/reference.png' alt='' width={1536} height={1024} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <h3>Мороженое</h3>
                  <p>Натуральные ингредиенты в традиционных рецептах с 2003 года.</p>
                  <span className='direction-card-link'>Смотреть продукцию <ArrowUpRight size={17} /></span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={.12}>
              <Link href='/contacts' className='direction-card'>
                <div className='direction-photo direction-photo-fish' role='img' aria-label='Свежая рыба и филе лосося на льду'>
                  <Image src='/images/directions/reference.png' alt='' width={1536} height={1024} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <h3>Рыба и морепродукты</h3>
                  <p>Надёжные поставки для вашей сети.</p>
                  <span className='direction-card-link'>Узнать ассортимент <ArrowUpRight size={17} /></span>
                </div>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={.18}>
            <div className='direction-partnership'>
              <Handshake className='partnership-icon' size={48} strokeWidth={1.2} aria-hidden />
              <div><h3>Для магазинов, ресторанов и дистрибьюторов</h3><p>Стабильные поставки. Гибкие условия. Личный менеджер.</p></div>
              <Link href='/contacts' className='pill partnership-button'>Сотрудничать <ArrowRight size={20} /></Link>
            </div>
          </Reveal>
        </section>
        </>}

        {(page === 'home' || page === 'catalog') && <section id='catalog' className='catalog-section section-pad'>
          <SectionTitle number='02'>Коллекция MARZO</SectionTitle>
          <div className='section-heading'><Reveal><ContentHeading className='page-title'>Выберите своё<br /><em>маленькое счастье.</em></ContentHeading></Reveal><Reveal className='catalog-scene-wrap' delay={.12}><div className='catalog-scene' aria-hidden='true'>{CATALOG.slice(-3).map((item, index) => <div key={item.src} className={`catalog-scene-card catalog-scene-card-${index}`}><Image src={item.src} alt='' width={600} height={800} unoptimized loading='lazy' /></div>)}</div></Reveal></div>
          <div className='catalog-toolbar'><div className='filter-tabs' role='group' aria-label='Категории мороженого'>{FILTERS.map(label => <button key={label} aria-pressed={filter === label} className={filter === label ? 'selected' : ''} onClick={() => { setFilter(label); setExpanded(false); }}>{label}</button>)}</div><span aria-live='polite'>{flavorCount(products.length)}</span></div>
          <motion.div className='product-grid' layout={!reduce}>
            {visible.map(item => <MotionLink layout={!reduce} key={item.n} className='product-card' href={productHref(item)} initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : .35 }} aria-label={`Подробнее: ${item.name}`}><div className='product-visual'><span className='product-category'>{category(item.n)}</span>{item.hot && <span className='product-label'>Любимый вкус</span>}<Image src={item.src} alt={item.name} width={600} height={800} unoptimized loading='lazy' /><span className='product-open'><ArrowUpRight size={20} /></span></div><div className='product-info'><span>MARZO / {String(item.n).padStart(2, '0')}</span><h3>{item.name.replace(/^MARZO\s*/, '')}</h3></div></MotionLink>)}
          </motion.div>
          {products.length > 8 && <button className='pill pill-outline show-more' onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть коллекцию' : `Все ${products.length} вкусов`}<ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} /></button>}
          <div className='catalog-note'><Snowflake size={17} />От производства до вашего стола — под контролем холода.</div>
        </section>}

        {(page === 'home' || page === 'about') && <section id='about' className='about-section section-pad'>
          <SectionTitle number='03' note='Гудермес, Чеченская Республика'>О компании</SectionTitle>
          <div className='about-layout'><Reveal><ContentHeading className='page-title'>Большое дело.<br /><em>Простые ценности.</em></ContentHeading><p className='about-intro'>Мы верим: хорошим продуктам<br />не нужны громкие обещания.</p></Reveal><Reveal delay={.15}><div className='about-copy'><p>RAMCAD — хладокомбинат в Чеченской Республике. С 2003 года мы работаем с тем, что требует особого внимания: натуральными ингредиентами, свежестью и вашим доверием.</p><p>Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта. Чтобы вкус оставался таким, каким его задумали.</p><Link href='/contacts' className='text-link'>Обсудить сотрудничество <ArrowUpRight size={17} /></Link></div></Reveal></div>
          <div className='about-advantages' aria-label='Преимущества хладокомбината'>
            {ADVANTAGES.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * .08}><article className='about-advantage'><Icon size={42} strokeWidth={1.2} aria-hidden /><h3>{title}</h3><p>{text}</p></article></Reveal>)}
          </div>
        </section>}

        {page === 'home' && <section id='news' className='news-section section-pad'><SectionTitle number='04' note='Из жизни компании · архив 2024'>Наши истории</SectionTitle><Reveal><h2>Есть чем <em>поделиться.</em></h2></Reveal><div className='news-grid'>{NEWS.map(item => <Reveal key={item.slug}><a className='news-card' href={`https://icechr.ru/${item.slug}`} target='_blank' rel='noopener noreferrer'><div className='news-image'><Image src={`/images/products/${String(item.image).padStart(2, '0')}.png`} width={600} height={800} unoptimized alt='' loading='lazy' /><span>{item.type}</span><ArrowUpRight size={24} /></div><time dateTime={item.iso}>{item.date}</time><h3>{item.title}</h3><p>{item.text}</p><span className='news-source'>Читать на icechr.ru <ArrowUpRight size={14} /></span></a></Reveal>)}</div></section>}

        {(page === 'home' || page === 'contacts') && <section id='contacts' className='contacts-section' aria-labelledby='contacts-heading'><div className='map-section'>
            <video className='map-route' ref={map} data-map-mode={page === 'contacts' ? 'intro' : 'scroll'} src={page === 'contacts' ? '/videos/karta-intro.mp4' : '/videos/karta-scroll.mp4'} poster={page === 'contacts' ? '/images/map-start.webp' : undefined} muted playsInline preload='auto' aria-label='Анимация маршрута к хладокомбинату в Гудермесе' /><div className='map-shade' /><div className='contact-card'><header className='contact-card-heading'><p className='eyebrow'><span />Приезжайте в гости</p><ContentHeading id='contacts-heading'>Контакты</ContentHeading></header><div className='contact-card-body'><address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address><div className='contact-card-links'><a className='contact-phone' href='tel:+79389042323'>+7 (938) 904-23-23 <ArrowUpRight size={20} /></a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div></div><p className='opening-hours'>Пн–Сб · 08:00–18:00<br />Воскресенье — выходной</p></div><span className='map-caption'>ГУДЕРМЕС / RAMCAD</span></div></section>}
        {page === 'product' && product && <ProductDetails product={product} />}
      </main>
      <footer className='landing-footer'><Link href='/' className='footer-brand' aria-label='RAMCAD — на главную'><svg viewBox='0 0 1000 180' role='img' aria-label='RAMCAD'><text x='0' y='165' textLength='1000' lengthAdjust='spacingAndGlyphs'>RAMCAD</text></svg></Link><div><span>© {new Date().getFullYear()} RAMCAD</span><nav className='footer-links' aria-label='Навигация в подвале'>{NAV.map(([id, href, label]) => <Link key={id} href={href} aria-current={activePage === id ? 'page' : undefined}>{label}</Link>)}</nav><a href='#main'>В начало <ArrowUpRight size={17} /></a></div></footer>
    </div>


  </div>;
}
