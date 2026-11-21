'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Factory, Handshake, Lightbulb, PackageCheck, Snowflake, UtensilsCrossed } from 'lucide-react';
import { CATALOG } from '@/lib/catalog';
import { ProductDetails } from '@/components/product-details';
import { HerringDetails } from '@/components/herring-details';
import { SceneBackdrop } from '@/components/scene-backdrop';
import { CatalogIntro } from '@/components/catalog-intro';
import { getProduct, PRODUCTS, productCategory as category, productCutout, productHref } from '@/lib/products';
import { getHerringProduct, HERRING_PRODUCTS, herringProductHref } from '@/lib/herring';
import { mountMapIntro } from '@/lib/map-intro.mjs';
import { mountMapScroll } from '@/lib/map-scroll.mjs';
import { mountHeroParallax } from '@/lib/hero-parallax.mjs';

const NAV = [['home', '/', 'Главная'], ['catalog', '/catalog', 'Каталог'], ['about', '/about', 'О компании'], ['contacts', '/contacts', 'Контакты']] as const;
export type SitePage = typeof NAV[number][0] | 'product' | 'herring';
const MotionLink = motion.create(Link);
const FILTERS = ['Все вкусы', 'Рожки', 'Эскимо', 'Стаканчики', 'Фруктовый лёд', 'Для семьи'];
const DEPARTMENTS = ['Мороженое', 'Рыба и морепродукты'] as const;
const flavorCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов'}`;
const itemCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'позиций' : n % 10 === 1 ? 'позиция' : n % 10 >= 2 && n % 10 <= 4 ? 'позиции' : 'позиций'}`;
const NEWS = [
  { date: '06.03.2024', iso: '2024-03-06', type: 'События', title: 'Когда хороший вкус объединяет', text: 'MARZO — партнёр интеллектуального вечера «Недвижимый квиз».', slug: '2024/03/06/estate-quiz/', image: 4 },
  { date: '29.02.2024', iso: '2024-02-29', type: 'Партнёрство', title: 'Кино, друзья и любимое мороженое', text: 'Уютный кинопросмотр вместе с MARZO и Lancman School.', slug: '2024/02/29/marzo-and-lancman/', image: 11 },
  { date: '18.02.2024', iso: '2024-02-18', type: 'Новый вкус', title: 'Маленький кусочек большого лета', text: 'Фруктовый лёд со вкусом дыни в коллекции MARZO.', slug: '2024/02/18/new-icecream/', image: 3 },
];

const FROST_PARTICLES = [
  { left: '6%', size: 5, duration: 13, delay: -2 },
  { left: '16%', size: 7, duration: 17, delay: -8 },
  { left: '27%', size: 4, duration: 11, delay: -4 },
  { left: '41%', size: 6, duration: 15, delay: -11 },
  { left: '55%', size: 5, duration: 12, delay: -1 },
  { left: '68%', size: 8, duration: 18, delay: -6 },
  { left: '79%', size: 4, duration: 14, delay: -9 },
  { left: '90%', size: 6, duration: 16, delay: -3 },
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

function SectionMark({ number, children, note }: { number: string; children: React.ReactNode; note?: string }) {
  return <div className='section-mark'>
    <span className='section-mark-figure' aria-hidden='true'>{number}</span>
    <div className='section-mark-body'><span className='section-mark-label'>{children}</span>{note && <span className='section-mark-note'>{note}</span>}</div>
  </div>;
}

export function Landing({ page = 'home', productId }: { page?: SitePage; productId?: string }) {
  const activePage = page === 'product' || page === 'herring' ? 'catalog' : page;
  const reduce = useReducedMotion();
  const ContentHeading = page === 'home' ? 'h2' : 'h1';
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>(DEPARTMENTS[0]);
  const [filter, setFilter] = useState('Все вкусы');
  const [expanded, setExpanded] = useState(false);
  const [mapDrawn, setMapDrawn] = useState(false);
  const [filterIndicator, setFilterIndicator] = useState<{ x: number; width: number } | null>(null);
  const map = useRef<HTMLVideoElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const cardRectsRef = useRef<Map<number, DOMRect>>(new Map());
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 30, mass: 1.2 });

  useEffect(() => mountHeroParallax(document.getElementById('hero')), [page]);
  useEffect(() => page === 'contacts' ? mountMapIntro(map.current) : undefined, [page]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-ready'); revealObserver.observe(el); });
    return () => revealObserver.disconnect();
  }, [page]);

  useEffect(() => page === 'home' ? mountMapScroll(map.current) : undefined, [page]);

  useLayoutEffect(() => {
    const container = filterTabsRef.current;
    if (!container) return;
    const measure = () => {
      const active = container.querySelector<HTMLButtonElement>('button.selected');
      if (active) setFilterIndicator({ x: active.offsetLeft, width: active.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filter, page, department]);

  // framer-motion's `layout` prop (FLIP via its projection system) doesn't
  // reliably interpolate the product grid when the filtered set changes —
  // it was observed to snap instantly rather than animate. A manual FLIP
  // (snapshot the old rect, apply it as a transform, then transition to
  // zero) sidesteps that and animates every time, not just sometimes.
  useLayoutEffect(() => {
    const grid = productGridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card-n]'));
    const previous = cardRectsRef.current;
    const next = new Map<number, DOMRect>();
    cards.forEach(card => {
      const n = Number(card.dataset.cardN);
      const newRect = card.getBoundingClientRect();
      next.set(n, newRect);
      if (reduce) return;
      const oldRect = previous.get(n);
      if (!oldRect) return;
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (!dx && !dy) return;
      card.style.transition = 'none';
      card.style.transform = `translate(${dx}px, ${dy}px)`;
      card.getBoundingClientRect();
      requestAnimationFrame(() => {
        card.style.transition = 'transform .5s cubic-bezier(.22,.61,.36,1)';
        card.style.transform = '';
      });
    });
    cardRectsRef.current = next;
  }, [filter, expanded, reduce, department]);

  useEffect(() => {
    const video = map.current;
    if (!video || (page !== 'home' && page !== 'contacts')) return;
    const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceQuery.matches) {
      const reducedFrame = requestAnimationFrame(() => setMapDrawn(true));
      return () => cancelAnimationFrame(reducedFrame);
    }
    const checkProgress = () => {
      if (Number.isFinite(video.duration) && video.duration > 0 && (video.ended || video.currentTime >= video.duration - .08)) setMapDrawn(true);
    };
    const initialFrame = requestAnimationFrame(() => {
      setMapDrawn(false);
      checkProgress();
    });
    video.addEventListener('timeupdate', checkProgress);
    video.addEventListener('ended', checkProgress);
    return () => {
      cancelAnimationFrame(initialFrame);
      video.removeEventListener('timeupdate', checkProgress);
      video.removeEventListener('ended', checkProgress);
    };
  }, [page]);

  const products = PRODUCTS.filter(item => filter === 'Все вкусы' || category(item.n) === filter);
  const visible = expanded ? products : products.slice(0, 8);
  const activeCount = department === DEPARTMENTS[1] ? HERRING_PRODUCTS.length : products.length;
  const product = productId ? getProduct(productId) : undefined;
  const herringProduct = page === 'herring' && productId ? getHerringProduct(productId) : undefined;
  const switchDepartment = (label: typeof DEPARTMENTS[number]) => { setDepartment(label); setFilter('Все вкусы'); setExpanded(false); };

  const handleGlow = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };
  const handleTilt = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - .5;
    const py = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty('--tilt-x', `${(py * -6).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`);
  };
  const resetTilt = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return <div className={`ramcad site-page-${page}`}>
    <motion.div className='reading-progress' style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <header className='main-header'>
      <Link href='/' className={`header-brand${page === 'home' ? ' header-brand-hero' : ''}`} aria-label='RAMCAD — на главную'>RAMCAD</Link>
      <nav id='main-navigation' className='header-links' aria-label='Основная навигация'>
        {NAV.map(([id, href, label]) => <Link key={id} href={href} aria-current={activePage === id ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <a className='header-phone' href='tel:+79389042323'>8 (938) 904-23-23</a>
    </header>

    <div className='page-content'>
      <main id='main'>
        {page === 'home' && <>
          <section id='hero' className='reference-hero scene-section'>
          <div className='reference-hero-photo'>
            <Image
              src='/images/home-hero-winter-marzo.webp'
              alt='Мороженое MARZO в зимней композиции на льду'
              fill
              sizes='100vw'
              priority
              unoptimized
            />
          </div>
          <span className='hero-frost' aria-hidden='true'>{FROST_PARTICLES.map((particle, index) => <span key={index} style={{ left: particle.left, '--size': `${particle.size}px`, '--dur': `${particle.duration}s`, '--delay': `${particle.delay}s` } as React.CSSProperties} />)}</span>
          <Link className='reference-hero-copy' href='/catalog'>Смотреть каталог</Link>
          <span className='hero-scroll-cue' aria-hidden='true'><ChevronDown size={18} strokeWidth={1.5} /></span>
        </section>

        <section id='directions' className='directions-section section-pad' onMouseMove={handleGlow}>
          <span className='ambient-glow' aria-hidden='true' />
          <Reveal className='direction-heading'>
            <h2>Эксперты в холоде.<br />Мастера вкуса.</h2>
            <p>Производим мороженое.<br />Поставляем рыбу и морепродукты.</p>
          </Reveal>
          <div className='direction-cards'>
            <Reveal className='direction-card-feature-wrap'>
              <Link href='/catalog' className='direction-card direction-card-feature' onMouseMove={handleTilt} onMouseLeave={resetTilt}>
                <div className='direction-photo direction-photo-ice'>
                  <Image src='/images/directions/marzo-products-on-ice.png' alt='Мороженое MARZO в упаковках и рожках на льду' width={1672} height={941} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <span className='direction-card-index'>01</span>
                  <h3>Мороженое</h3>
                  <p>Натуральные ингредиенты в традиционных рецептах с 2003 года.</p>
                  <span className='direction-card-link'>Смотреть продукцию</span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={.12}>
              <Link href='/herring/herring-oil-500' className='direction-card' onMouseMove={handleTilt} onMouseLeave={resetTilt}>
                <div className='direction-photo direction-photo-fish'>
                  <Image src='/images/directions/iceberg-herring-on-ice.png' alt='Сельдь АЙСБЕРГ с филе и красным луком на льду' width={1774} height={887} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <span className='direction-card-index'>02</span>
                  <h3>Рыба и морепродукты</h3>
                  <p>Надёжные поставки для вашей сети.</p>
                  <span className='direction-card-link'>Узнать ассортимент</span>
                </div>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={.18}>
            <div className='direction-partnership'>
              <Handshake className='partnership-icon' size={40} strokeWidth={1.2} aria-hidden />
              <div><h3>Для магазинов, ресторанов и дистрибьюторов</h3><p>Стабильные поставки. Гибкие условия. Личный менеджер.</p></div>
              <Link href='/contacts' className='pill partnership-button'>Сотрудничать <ArrowRight size={20} /></Link>
            </div>
          </Reveal>
        </section>
        </>}

        {page === 'catalog' && <CatalogIntro />}
        {(page === 'home' || page === 'catalog') && <section id='catalog' className='catalog-section section-pad scene-section'>
          <SceneBackdrop />
          {page === 'home' ? <>
          <Reveal><SectionMark number='02'>Коллекция MARZO</SectionMark></Reveal>
          <div className='section-heading'><Reveal><ContentHeading className='page-title'>Выберите своё<br /><em>маленькое счастье.</em></ContentHeading></Reveal><Reveal className='catalog-scene-wrap' delay={.12}><div className='catalog-scene' aria-hidden='true'>{CATALOG.slice(-3).map((item, index) => <div key={item.src} className={`catalog-scene-card catalog-scene-card-${index}`}><Image src={item.src} alt='' width={600} height={800} unoptimized loading='lazy' /></div>)}</div></Reveal></div>
          </> : <h2 className='sr-only'>Каталог мороженого MARZO</h2>}
          {page === 'catalog' && <div className='department-tabs' role='group' aria-label='Разделы каталога'>{DEPARTMENTS.map(label => <button key={label} aria-pressed={department === label} className={department === label ? 'selected' : ''} onClick={() => switchDepartment(label)}>{label}</button>)}</div>}
          <div id='catalog-products' className='catalog-toolbar'>{department === DEPARTMENTS[0] ? <div className='filter-tabs' ref={filterTabsRef} role='group' aria-label='Категории мороженого'>{filterIndicator && <motion.span className='filter-tab-indicator' initial={false} animate={{ x: filterIndicator.x, width: filterIndicator.width }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}{FILTERS.map(label => <button key={label} aria-pressed={filter === label} className={filter === label ? 'selected' : ''} onClick={() => { setFilter(label); setExpanded(false); }}>{label}</button>)}</div> : <p className='catalog-toolbar-note'>Рыбные пресервы «Айсберг». Качество и поставка — под контролем RAMCAD.</p>}<span className='catalog-count' aria-live='polite'><AnimatePresence mode='popLayout' initial={false}><motion.span key={activeCount} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .3, ease: [.22, .61, .36, 1] }}>{department === DEPARTMENTS[0] ? flavorCount(activeCount) : itemCount(activeCount)}</motion.span></AnimatePresence></span></div>
          <div className='product-grid' ref={productGridRef}>
            {department === DEPARTMENTS[0]
              ? visible.map(item => <MotionLink data-card-n={item.n} key={item.n} className='product-card' href={productHref(item)} initial={false} aria-label={`Подробнее: ${item.name}`}>
                <div className='product-visual'>
                  <span className='product-category'>{item.category}</span>
                  <Image src={productCutout(item)} alt='' width={600} height={800} unoptimized loading='lazy' />
                  <span className='product-open'><ArrowUpRight size={18} aria-hidden='true' /></span>
                </div>
                <div className='product-info'><span>{item.brand}</span><h3>{item.name.replace(/^MARZO\s*/, '')}</h3></div>
              </MotionLink>)
              : HERRING_PRODUCTS.map((item, index) => <MotionLink data-card-n={1000 + index} key={item.id} className='product-card' href={herringProductHref(item)} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { duration: .35 }} aria-label={`Подробнее: ${item.title} ${item.subtitle}, ${item.weight}`}><div className='product-visual'><span className='product-category'>{item.weight}</span><Image src={item.fishImage} alt={`${item.title} ${item.subtitle}`} width={1254} height={1254} unoptimized loading='lazy' /><span className='product-open'><ArrowUpRight size={18} /></span></div><div className='product-info'><span>{item.brand} / {item.format}</span><h3>{item.title} {item.subtitle}</h3></div></MotionLink>)}
          </div>
          {department === DEPARTMENTS[0] && products.length > 8 && <button className='pill pill-outline show-more' onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть коллекцию' : `Все ${products.length} вкусов`}<ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} /></button>}
          <div className='catalog-note'><Snowflake size={17} />От производства до вашего стола — под контролем холода.</div>
        </section>}

        {(page === 'home' || page === 'about') && <section id='about' className='about-section section-pad scene-section'>
          <SceneBackdrop />
          <Reveal><SectionMark number='03' note='Гудермес, Чеченская Республика'>О компании</SectionMark></Reveal>
          <div className='about-layout'><Reveal><ContentHeading className='page-title'>Большое дело.<br /><em>Простые ценности.</em></ContentHeading><p className='about-intro'>Мы верим: хорошим продуктам<br />не нужны громкие обещания.</p></Reveal><Reveal delay={.15}><div className='about-copy'><p>RAMCAD — хладокомбинат в Чеченской Республике. С 2003 года мы работаем с тем, что требует особого внимания: натуральными ингредиентами, свежестью и вашим доверием.</p><p>Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта. Чтобы вкус оставался таким, каким его задумали.</p><Link href='/contacts' className='text-link'>Обсудить сотрудничество</Link></div></Reveal></div>
          <div className='about-list' aria-label='Преимущества хладокомбината'>
            {ADVANTAGES.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * .07} className='about-row'>
              <span className='about-row-index'>{String(index + 1).padStart(2, '0')}</span>
              <Icon className='about-row-icon' size={30} strokeWidth={1.2} aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>)}
          </div>
        </section>}

        {page === 'home' && <section id='news' className='news-section section-pad'>
          <Reveal><SectionMark number='04' note='Архив новостей 2024 года'>Наши истории</SectionMark></Reveal>
          <Reveal><h2>Есть чем <em>поделиться.</em></h2></Reveal>
          <div className='news-list'>
            {NEWS.map((item, index) => <Reveal key={item.slug} className='news-row'>
              <a className='news-row-link' href={`https://icechr.ru/${item.slug}`} target='_blank' rel='noopener noreferrer'>
                <span className='news-row-index'>{String(index + 1).padStart(2, '0')}</span>
                <div className='news-row-media'><Image src={`/images/products/${String(item.image).padStart(2, '0')}.png`} width={600} height={800} unoptimized alt='' loading='lazy' /></div>
                <div className='news-row-body'>
                  <div className='news-row-meta'><time dateTime={item.iso}>{item.date}</time><span>{item.type}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <span className='news-row-cta'>Читать на icechr.ru</span>
              </a>
            </Reveal>)}
          </div>
        </section>}

        {(page === 'home' || page === 'contacts') && <section id='contacts' className='contacts-section' aria-labelledby='contacts-heading'><div className='map-section'>
            <video className='map-route' ref={map} data-map-mode={page === 'contacts' ? 'intro' : 'scroll'} src={page === 'contacts' ? '/videos/karta-intro.mp4' : '/videos/karta-scroll.mp4'} poster={page === 'contacts' ? '/images/map-start.webp' : undefined} muted playsInline preload='auto' aria-label='Анимация маршрута к хладокомбинату в Гудермесе' />
            <div className='map-shade' />
            <div className='contact-panel-anchor'>
              <motion.div className='contact-panel' initial={false} animate={mapDrawn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 46, scale: .97 }} transition={{ duration: .75, ease: [.22, .61, .36, 1] }}>
                <p className='contact-card-lead'>Приезжайте в гости</p>
                <ContentHeading id='contacts-heading'>Контакты</ContentHeading>
                <address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address>
                <div className='contact-card-links'><a className='contact-phone' href='tel:+79389042323'>+7 (938) 904-23-23</a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div>
                <p className='opening-hours'>Пн–Сб, 08:00–18:00<br />Воскресенье — выходной</p>
              </motion.div>
            </div>
            <span className='map-caption'>Гудермес, Чеченская Республика</span>
          </div>
        </section>}
        {page === 'product' && product && <ProductDetails product={product} />}
        {page === 'herring' && herringProduct && <HerringDetails product={herringProduct} />}
      </main>
      <footer className='landing-footer scene-section' onMouseMove={handleGlow}>
        <SceneBackdrop />
        <span className='ambient-glow' aria-hidden='true' />
        <div className='footer-top'>
          <Link href='/' className='footer-brand' aria-label='RAMCAD — на главную'><svg viewBox='0 0 1000 180' role='img' aria-label='RAMCAD'><text x='0' y='165' textLength='1000' lengthAdjust='spacingAndGlyphs'>RAMCAD</text></svg></Link>
          <div className='footer-contact'><a href='tel:+79389042323'>+7 (938) 904-23-23</a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div>
        </div>
        <div className='footer-bottom'>
          <span>© {new Date().getFullYear()} RAMCAD</span>
          <nav className='footer-links' aria-label='Навигация в подвале'>{NAV.map(([id, href, label]) => <Link key={id} href={href} aria-current={activePage === id ? 'page' : undefined}>{label}</Link>)}</nav>
          <a href='#main'>В начало</a>
        </div>
      </footer>
    </div>
  </div>;
}
