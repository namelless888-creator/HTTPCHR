'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Factory, Fish, IceCreamBowl, Handshake, Lightbulb, PackageCheck, Search, Snowflake, Truck, UtensilsCrossed, X } from 'lucide-react';
import { CATALOG } from '@/lib/catalog';
import { ProductDetails } from '@/components/product-details';
import { ContactRequest } from '@/components/contact-request';
import { HerringDetails } from '@/components/herring-details';
import { SceneBackdrop } from '@/components/scene-backdrop';
import { getProduct, PRODUCTS, productCategory as category, productCutout, productHref } from '@/lib/products';
import { getHerringProduct, HERRING_PRODUCTS, herringProductHref } from '@/lib/herring';
import { mountMapIntro } from '@/lib/map-intro.mjs';
import { mountMapScroll } from '@/lib/map-scroll.mjs';
import { mountHeroParallax } from '@/lib/hero-parallax.mjs';
import { asset } from '@/lib/site';
import { LEGAL } from '@/lib/site';
import { latestNews, getNewsBySlug } from '@/lib/news';
import { NewsIndex, NewsArticle } from '@/components/news-content';
import { AboutHero, AboutClosing, FlavorRibbon, ManifestoWords, PartnershipFinal } from '@/components/brand-scenes';

const NAV = [['home', '/', 'Главная'], ['catalog', '/catalog', 'Каталог'], ['about', '/about', 'О компании'], ['news', '/news', 'Новости'], ['contacts', '/contacts', 'Контакты']] as const;
export type SitePage = typeof NAV[number][0] | 'product' | 'herring' | 'privacy';
const MotionLink = motion.create(Link);
const FILTERS = ['Все вкусы', 'Рожки', 'Эскимо', 'Стаканчики', 'Фруктовый лёд', 'Для семьи'];
const HOME_FILTERS = ['Мороженое', 'Рыба'];
const CARD_PREVIEW = 12;
const TRUST = [
  { value: '2003', label: 'год основания' },
  { value: '3', label: 'производственных цеха' },
  { value: String(PRODUCTS.length), label: 'позиций мороженого' },
  { value: String(HERRING_PRODUCTS.length), label: 'рыбных пресервов' },
];
const DEPARTMENTS = ['Мороженое', 'Рыба и морепродукты'] as const;
const flavorCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов'}`;
const itemCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'позиций' : n % 10 === 1 ? 'позиция' : n % 10 >= 2 && n % 10 <= 4 ? 'позиции' : 'позиций'}`;
const NEWS = latestNews();

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

const COLLECTION_TINTS: Record<string, [string, string]> = {
  'Рожки': ['#f0dfc8', '#fbf7f1'],
  'Эскимо': ['#e2d4ea', '#faf6fb'],
  'Стаканчики': ['#d6e6f2', '#fbfdfe'],
  'Фруктовый лёд': ['#d6ecdd', '#f8fcf9'],
  'Для семьи': ['#eeddc6', '#fcf9f4'],
};

const COLLECTIONS = FILTERS.filter(label => label !== 'Все вкусы').map(label => ({
  label,
  count: PRODUCTS.filter(item => category(item.n) === label).length,
  sample: PRODUCTS.find(item => category(item.n) === label),
}));

const collectionStyle = (label: string): CSSProperties => {
  const [a, b] = COLLECTION_TINTS[label] ?? ['#dbe7ee', '#fbfdfe'];
  return { '--tint-a': a, '--tint-b': b } as CSSProperties;
};

const PROCESS = [
  { icon: PackageCheck, title: 'Сырьё', text: 'Натуральные ингредиенты, с которых начинается вкус.' },
  { icon: Factory, title: 'Производство', text: 'Три отдельных цеха и высокоточное оборудование.' },
  { icon: Snowflake, title: 'Холод', text: 'Свой температурный режим для каждого продукта.' },
  { icon: Truck, title: 'Доставка', text: 'От производства до вашего стола — под контролем холода.' },
];

const STORY = [
  { mark: '2003', title: 'Начало', text: 'Хладокомбинат в Гудермесе начинает работу с мороженым.' },
  { mark: 'Цеха', title: 'Производство', text: 'Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта.' },
  { mark: 'Сегодня', title: 'Ассортимент', text: `${PRODUCTS.length} вкусов мороженого MARZO и ${HERRING_PRODUCTS.length} рыбных пресервов «Айсберг». Поставки для магазинов, кафе и сетей.` },
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

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    // Only rewind off-screen numbers, so a number already on screen never
    // flashes from its value down to zero on load.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) setDisplay(0);
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 900);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .35 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function Landing({ page = 'home', productId, newsSlug }: { page?: SitePage; productId?: string; newsSlug?: string }) {
  const activePage = page === 'product' || page === 'herring' ? 'catalog' : page;
  const reduce = useReducedMotion();
  const ContentHeading = page === 'home' || page === 'about' ? 'h2' : 'h1';
  const newsItem = newsSlug ? getNewsBySlug(newsSlug) : undefined;
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>(DEPARTMENTS[0]);
  const [filter, setFilter] = useState('Все вкусы');
  const [expanded, setExpanded] = useState(false);
  const [filterIndicator, setFilterIndicator] = useState<{ x: number; width: number } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [catalogQuery, setCatalogQuery] = useState('');
  const map = useRef<HTMLVideoElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const cardRectsRef = useRef<Map<number, DOMRect>>(new Map());
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 30, mass: 1.2 });

  useEffect(() => mountHeroParallax(document.getElementById('hero')), [page]);
  useEffect(() => page === 'contacts' ? mountMapIntro(map.current) : undefined, [page]);
  useEffect(() => {
    if (!searchOpen) return;
    const panel = searchPanelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSearchOpen(false); searchTriggerRef.current?.focus(); return; }
      if (event.key !== 'Tab' || !panel) return;
      // Keep keyboard focus inside the modal while it is open.
      const items = [...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')]
        .filter(item => item.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);
  useEffect(() => {
    if ((page === 'home' || page === 'catalog') && new URLSearchParams(window.location.search).get('department') === 'fish') {
      const frame = requestAnimationFrame(() => setDepartment(DEPARTMENTS[1]));
      return () => cancelAnimationFrame(frame);
    }
  }, [page]);

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

  const catalogTerm = catalogQuery.trim().toLowerCase();
  const products = PRODUCTS.filter(item => (filter === 'Все вкусы' || category(item.n) === filter)
    && (!catalogTerm || `${item.name} ${item.taste} ${item.category} ${item.brand}`.toLowerCase().includes(catalogTerm)));
  const visible = expanded ? products : products.slice(0, CARD_PREVIEW);
  const activeCount = department === DEPARTMENTS[1] ? HERRING_PRODUCTS.length : products.length;
  const filterCount = (label: string) => label === 'Все вкусы' ? PRODUCTS.length : PRODUCTS.filter(item => category(item.n) === label).length;
  const searchTerm = query.trim().toLowerCase();
  const searchResults = searchTerm
    ? [
        ...PRODUCTS.filter(item => `${item.name} ${item.taste} ${item.category} ${item.brand}`.toLowerCase().includes(searchTerm)).slice(0, 6).map(item => ({ key: `p${item.n}`, href: productHref(item), title: item.name.replace(/^MARZO\s*/, ''), meta: `${item.brand} · ${item.category}` })),
        ...HERRING_PRODUCTS.filter(item => `${item.title} ${item.subtitle} ${item.format}`.toLowerCase().includes(searchTerm)).slice(0, 3).map(item => ({ key: `h${item.id}`, href: herringProductHref(item), title: `${item.title} ${item.subtitle}`, meta: `${item.brand} · ${item.weight}` })),
      ]
    : [];
  const product = productId ? getProduct(productId) : undefined;
  const herringProduct = page === 'herring' && productId ? getHerringProduct(productId) : undefined;
  const switchDepartment = (label: typeof DEPARTMENTS[number]) => {
    setDepartment(label);
    setFilter('Все вкусы');
    setExpanded(false);
    setCatalogQuery('');
    const url = new URL(window.location.href);
    if (label === DEPARTMENTS[1]) url.searchParams.set('department', 'fish');
    else url.searchParams.delete('department');
    window.history.replaceState(null, '', url);
  };

  const handleGlow = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };
  const handleTilt = (event: React.MouseEvent<HTMLElement>) => {
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - .5;
    const py = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty('--tilt-x', `${(py * -12).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(px * 12).toFixed(2)}deg`);
  };
  const resetTilt = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const featureShown = page === 'catalog' && filter === 'Все вкусы' && !catalogTerm;
  // The insert must land on a full row edge: the featured plate eats two cells.
  const insertAt = featureShown ? 7 : 8;

  const renderIceCard = (item: (typeof PRODUCTS)[number], index: number) => {
    const isFeature = featureShown && index === 0;    return <MotionLink data-card-n={item.n} key={item.n} className={`product-card${isFeature ? ' product-card-featured' : ''}`} href={productHref(item)} initial={false} onMouseMove={handleTilt} onMouseLeave={resetTilt} style={{ '--card-i': index } as CSSProperties} aria-label={`Подробнее: ${item.name}`}>
      <div className='product-visual'>
        <span className='product-category'>{item.category}</span>
        <Image src={productCutout(item)} alt='' width={600} height={800} loading='lazy' />
        <span className='product-open'><ArrowUpRight size={18} aria-hidden='true' /></span>
        {isFeature && <span className='product-feature-flag'>Крупным планом</span>}
      </div>
      <div className='product-info'>
        <span className='product-brand'>{item.brand}</span>
        <h3>{item.name.replace(/^MARZO\s*/, '')}</h3>
        <p className='product-taste'>{item.description}</p>
      </div>
    </MotionLink>;
  };

  const breadcrumbLabel = page === 'about' ? 'О компании' : page === 'catalog' ? 'Каталог' : page === 'news' ? 'Новости' : page === 'contacts' ? 'Контакты' : page === 'privacy' ? 'Политика конфиденциальности' : null;

  return <div className={`ramcad site-page-${page}`}>
    <motion.div className='reading-progress' style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <header className='main-header'>
      <Link href='/' className={`header-brand${page === 'home' ? ' header-brand-hero header-brand-plain' : ''}`} aria-label='Айсберг — на главную'>
        <span className='header-brand-word'>Айсберг</span>
      </Link>
      <nav id='main-navigation' className='header-links' aria-label='Основная навигация'>
        {NAV.map(([id, href, label]) => <Link key={id} href={href} aria-current={activePage === id ? 'page' : undefined}>{label}</Link>)}
        <button ref={searchTriggerRef} className='header-search' type='button' aria-label='Поиск по каталогу' aria-expanded={searchOpen} onClick={() => { setSearchOpen(true); setQuery(''); }}>
          <Search size={17} strokeWidth={1.6} aria-hidden='true' />
          <span className='header-search-label' aria-hidden='true'>Поиск</span>
        </button>
      </nav>
      <a className='header-phone' href='tel:+79389042323'>8 (938) 904-23-23</a>
    </header>

    <AnimatePresence>
      {searchOpen && <motion.div className='site-search' role='dialog' aria-modal='true' aria-label='Поиск по каталогу' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
        <div className='site-search-inner' ref={searchPanelRef}>
          <div className='site-search-bar'>
            <Search size={22} strokeWidth={1.5} aria-hidden='true' />
            <input autoFocus value={query} onChange={event => setQuery(event.target.value)} type='search' placeholder='Вкус, продукт или категория' aria-label='Поисковый запрос' />
            <button type='button' onClick={() => { setSearchOpen(false); searchTriggerRef.current?.focus(); }} aria-label='Закрыть поиск'><X size={22} strokeWidth={1.5} aria-hidden='true' /></button>
          </div>
          {searchTerm && <div className='site-search-results' aria-live='polite'>
            {searchResults.length > 0
              ? searchResults.map(result => <Link key={result.key} href={result.href} onClick={() => setSearchOpen(false)}>
                  <span><strong>{result.title}</strong><small>{result.meta}</small></span>
                  <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden='true' />
                </Link>)
              : <p className='site-search-empty'>Ничего не нашли. Попробуйте другой вкус или категорию.</p>}
          </div>}
          {!searchTerm && <p className='site-search-hint'>Например: фисташка, пломбир, рожок или сельдь.</p>}
        </div>
      </motion.div>}
    </AnimatePresence>

    {breadcrumbLabel && <nav className='page-breadcrumbs' aria-label='Хлебные крошки'>
      <Link href='/'>Главная</Link><ChevronRight size={12} strokeWidth={1.5} aria-hidden='true' />
      <span aria-current='page'>{breadcrumbLabel}</span>
    </nav>}

    <div className='page-content'>
      <main id='main'>
        {page === 'news' && (newsItem ? <NewsArticle item={newsItem} /> : <NewsIndex />)}
        {page === 'about' && <AboutHero />}
        {page === 'home' && <>
          <h1 className='sr-only'>RAMKAD — хладокомбинат: мороженое MARZO и рыбные пресервы «Айсберг»</h1>
          <section id='hero' className='reference-hero scene-section'>
          <div className='reference-hero-photo'>
            <Image
              src='/images/home-hero-winter-marzo.webp'
              alt='Мороженое MARZO в зимней композиции на льду'
              fill
              sizes='100vw'
              priority
             
            />
          </div>
          <span className='hero-frost' aria-hidden='true'>{FROST_PARTICLES.map((particle, index) => <span key={index} style={{ left: particle.left, '--size': `${particle.size}px`, '--dur': `${particle.duration}s`, '--delay': `${particle.delay}s` } as CSSProperties} />)}</span>
          <div className='reference-hero-copy reference-hero-actions'>
            <Link className='hero-action hero-action-primary' href='/catalog'>Смотреть каталог <ArrowRight size={18} strokeWidth={1.6} aria-hidden='true' /></Link>
            <Link className='hero-action hero-action-secondary' href='/contacts#request'>Оставить заявку</Link>
          </div>
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
                  <Image src='/images/directions/marzo-products-on-ice.png' alt='Мороженое MARZO в упаковках и рожках на льду' width={1672} height={941} />
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
              <Link href='/catalog?department=fish#catalog-products' className='direction-card' onMouseMove={handleTilt} onMouseLeave={resetTilt}>
                <div className='direction-photo direction-photo-fish'>
                  <Image src='/images/directions/iceberg-herring-on-ice.png' alt='Сельдь АЙСБЕРГ с филе и красным луком на льду' width={1774} height={887} />
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

        <section className='trust-strip' aria-label='Хладокомбинат в цифрах'>
          <Reveal className='trust-strip-inner'>
            <div className='trust-strip-intro'>
              <span className='trust-eyebrow'>Хладокомбинат полного цикла</span>
              <p>Мороженое и рыба из Гудермеса — собственное производство с 2003 года.</p>
            </div>
            <dl className='trust-stats'>
              {TRUST.map(stat => <div key={stat.label}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}
            </dl>
            <Link className='trust-link' href='/about'>О производстве <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden='true' /></Link>
          </Reveal>
        </section>
        </>}

        {page === 'catalog' && <section className='catalog-hero'>
          <div className='catalog-hero-copy'>
            <p className='catalog-hero-eyebrow'>Каталог · оптовые поставки</p>
            <h1>Мороженое и рыба.<br /><em>Без лишнего.</em></h1>
            <p className='catalog-hero-lead'>MARZO и «Айсберг»: {PRODUCTS.length} позиций мороженого и {HERRING_PRODUCTS.length} рыбных пресервов. Работаем с магазинами, кафе и сетями.</p>
            <div className='catalog-hero-actions'>
              <a className='pill pill-dark' href='#catalog-products'>К ассортименту <ArrowDown size={18} strokeWidth={1.6} aria-hidden='true' /></a>
              <Link className='pill pill-outline' href='/contacts#request'>Оставить заявку <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden='true' /></Link>
            </div>
          </div>
          <div className='catalog-hero-media' aria-hidden='true' onMouseMove={handleTilt} onMouseLeave={resetTilt}>
            {[PRODUCTS[1], PRODUCTS[11], PRODUCTS[26]].map((item, index) => <span key={item.id} className={`catalog-hero-pack catalog-hero-pack-${index}`}>
              <Image src={productCutout(item)} alt='' width={600} height={800} priority={index === 1} />
            </span>)}
            <span className='catalog-hero-media-note'>{PRODUCTS.length} позиций мороженого · {HERRING_PRODUCTS.length} рыбных пресервов</span>
          </div>
        </section>}
        {page === 'catalog' && <FlavorRibbon />}
        {(page === 'home' || page === 'catalog') && <section id='catalog' data-department={department === DEPARTMENTS[0] ? 'ice' : 'fish'} className='catalog-section section-pad scene-section' onMouseMove={handleGlow}>
          <SceneBackdrop />
          <div className='catalog-atmosphere' aria-hidden='true'><span className='catalog-orbit' /><span className='catalog-wordmark'>{department === DEPARTMENTS[0] ? 'MARZO' : 'АЙСБЕРГ'}</span><span className='ambient-glow' /></div>
          {page === 'home' ? <>
          <Reveal><SectionMark number='02'>Каталог RAMKAD</SectionMark></Reveal>
          <div className='section-heading'><Reveal><ContentHeading className='page-title'>Выберите своё<br /><em>маленькое счастье.</em></ContentHeading></Reveal><Reveal className='catalog-scene-wrap' delay={.12}><div className='catalog-scene' aria-hidden='true'>{CATALOG.slice(-3).map((item, index) => <div key={item.src} className={`catalog-scene-card catalog-scene-card-${index}`}><Image src={item.src} alt='' width={600} height={800} loading='lazy' /></div>)}</div></Reveal></div>
          </> : null}
          {page === 'catalog' && <>
            <div className='catalog-chapter'>
              <span className='catalog-chapter-index' aria-hidden='true'>{department === DEPARTMENTS[0] ? '01' : '02'}</span>
              <div className='catalog-chapter-copy'>
                <h2>{department === DEPARTMENTS[0] ? 'Мороженое' : 'Рыба и морепродукты'}</h2>
                <p>{department === DEPARTMENTS[0]
                  ? 'Рожки, эскимо, стаканчики, фруктовый лёд и семейные форматы MARZO.'
                  : 'Пресервы «Айсберг»: сельдь кусочками, филе и в масле.'}</p>
              </div>
              <div className='catalog-chapter-side'>
                <span className='catalog-chapter-count'>{department === DEPARTMENTS[0] ? flavorCount(PRODUCTS.length) : itemCount(HERRING_PRODUCTS.length)}</span>
                <div className='department-tabs' role='group' aria-label='Разделы каталога'>{DEPARTMENTS.map((label, index) => <button key={label} type='button' aria-controls='catalog-products' aria-pressed={department === label} className={department === label ? 'selected' : ''} onClick={() => switchDepartment(label)}>
                  {index === 0 ? <IceCreamBowl aria-hidden='true' /> : <Fish aria-hidden='true' />}
                  <span className='department-label'>{label}</span>
                  <span className='department-total' aria-hidden='true'>{index === 0 ? PRODUCTS.length : HERRING_PRODUCTS.length}</span>
                  <span className='sr-only'>{index === 0 ? flavorCount(PRODUCTS.length) : itemCount(HERRING_PRODUCTS.length)}</span>
                </button>)}</div>
              </div>
            </div>
            {department === DEPARTMENTS[0] && <div className='collection-row' aria-label='Подборки вкусов'>
              {COLLECTIONS.map(collection => collection.sample && <button key={collection.label} type='button' className='collection-card' style={collectionStyle(collection.label)} onClick={() => {
                setFilter(collection.label);
                setExpanded(false);
                setCatalogQuery('');
                document.getElementById('catalog-products')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
              }}>
                <span className='collection-stage'><Image src={productCutout(collection.sample)} alt='' width={600} height={800} loading='lazy' /></span>
                <span className='collection-meta'><span className='collection-name'>{collection.label}</span><span className='collection-count'>{collection.count}</span></span>
              </button>)}
            </div>}
          </>}
          <div id='catalog-products' className='catalog-toolbar'>
            {(page === 'home' || department === DEPARTMENTS[0])
              ? <div className='filter-tabs' ref={filterTabsRef} role='group' aria-label={page === 'home' ? 'Разделы каталога' : 'Категории мороженого'}>
                  {filterIndicator && <motion.span className='filter-tab-indicator' initial={false} animate={{ x: filterIndicator.x, width: filterIndicator.width }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
                  {(page === 'home' ? HOME_FILTERS : FILTERS).map(label => {
                    const selected = label === 'Рыба' ? department === DEPARTMENTS[1] : page === 'home' ? department === DEPARTMENTS[0] : department === DEPARTMENTS[0] && filter === label;
                    return <button key={label} data-filter={label} aria-pressed={selected} className={selected ? 'selected' : ''} onClick={() => { if (page === 'home') switchDepartment(label === 'Рыба' ? DEPARTMENTS[1] : DEPARTMENTS[0]); else { setFilter(label); setExpanded(false); } }}>
                      {label}{page === 'catalog' && <span className='filter-count' aria-hidden='true'>{filterCount(label)}</span>}
                    </button>;
                  })}
                </div>
              : <p className='catalog-toolbar-note'>Рыбные пресервы «Айсберг». Качество и поставка — под контролем RAMKAD.</p>}
            <div className='catalog-tools'>
              {page === 'catalog' && department === DEPARTMENTS[0] && <div className='catalog-search' role='search'>
                <Search size={16} strokeWidth={1.6} aria-hidden='true' />
                <input type='search' value={catalogQuery} onChange={event => { setCatalogQuery(event.target.value); setExpanded(false); }} placeholder='Найти вкус или продукт' aria-label='Поиск по каталогу' />
                <button type='button' hidden={!catalogQuery} onClick={() => setCatalogQuery('')} aria-label='Очистить поиск'><X size={14} aria-hidden='true' /></button>
              </div>}
              <span className='catalog-count' aria-live='polite'><AnimatePresence mode='popLayout' initial={false}><motion.span key={activeCount} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .3, ease: [.22, .61, .36, 1] }}>{department === DEPARTMENTS[0] ? flavorCount(activeCount) : itemCount(activeCount)}</motion.span></AnimatePresence></span>
            </div>
          </div>
          {department === DEPARTMENTS[0] && products.length === 0 && <div className='catalog-empty'>
            <p>По запросу «{catalogQuery.trim()}» ничего не нашлось.</p>
            <button type='button' className='text-link' onClick={() => { setCatalogQuery(''); setFilter('Все вкусы'); }}>Сбросить фильтры</button>
          </div>}
          <div className={`product-grid${page === 'catalog' && department === DEPARTMENTS[1] ? ' product-grid-duo' : ''}`} ref={productGridRef}>
            {department === DEPARTMENTS[0]
              ? <>
                  {visible.slice(0, insertAt).map((item, index) => renderIceCard(item, index))}
                  {page === 'catalog' && visible.length > insertAt && <div className='grid-insert'>
                    <div className='grid-insert-copy'>
                      <span className='grid-insert-eyebrow'>Между рядами</span>
                      <p>От цеха до полки — <em>одна холодовая цепь.</em></p>
                    </div>
                    <ul className='grid-insert-list'>
                      <li><Snowflake size={19} strokeWidth={1.4} aria-hidden='true' /><span><strong>Свой режим</strong>температура под каждый продукт</span></li>
                      <li><Factory size={19} strokeWidth={1.4} aria-hidden='true' /><span><strong>Три цеха</strong>мороженое и пресервы</span></li>
                      <li><PackageCheck size={19} strokeWidth={1.4} aria-hidden='true' /><span><strong>Свои камеры</strong>хранение на месте</span></li>
                    </ul>
                  </div>}
                  {visible.slice(insertAt).map((item, index) => renderIceCard(item, index + insertAt))}
                </>
              : HERRING_PRODUCTS.map((item, index) => <MotionLink data-card-n={1000 + index} key={item.id} className='product-card' href={herringProductHref(item)} onMouseMove={handleTilt} onMouseLeave={resetTilt} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { duration: .35 }} style={{ '--card-i': index } as CSSProperties} aria-label={`Подробнее: ${item.title} ${item.subtitle}, ${item.weight}`}>
                  <div className='product-visual product-visual-fish'>
                    <span className='product-category'>{item.weight}</span>
                    <div className='herring-card-pack' aria-hidden='true'>
                      <Image className='herring-card-pack-base' src='/images/herring/packaging-tub.png' alt='' width={1254} height={1254} loading='lazy' />
                      <Image className='herring-card-pack-label' src={item.labelImage} alt='' width={1401} height={1401} loading='lazy' />
                    </div>
                    <Image className='herring-card-fish' src={item.fishImage} alt='' width={1254} height={1254} loading='lazy' />
                    <span className='product-open'><ArrowUpRight size={18} /></span>
                  </div>
                  <div className='product-info'>
                    <span className='product-brand'>{item.brand} / {item.format}</span>
                    <h3>{item.title} {item.subtitle}</h3>
                    <p className='product-taste'>{item.description}</p>
                  </div>
                </MotionLink>)}
          </div>
          {department === DEPARTMENTS[0] && products.length > CARD_PREVIEW && <button className='pill pill-outline show-more' onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть коллекцию' : `Все ${products.length} вкусов`}<ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} /></button>}
          <div className='catalog-note'><Snowflake size={17} />От производства до вашего стола — под контролем холода.</div>
        </section>}

        {(page === 'home' || page === 'about') && <section id='about' className='about-section section-pad scene-section'>
          <SceneBackdrop />
          <Reveal><SectionMark number='03' note='Гудермес, Чеченская Республика'>О компании</SectionMark></Reveal>
          <div className='about-layout'><Reveal><ContentHeading className='page-title'>Большое дело.<br /><em>Простые ценности.</em></ContentHeading><p className='about-intro'>Мы верим: хорошим продуктам<br />не нужны громкие обещания.</p></Reveal><Reveal delay={.15}><div className='about-copy'><p>RAMKAD — хладокомбинат в Чеченской Республике. С 2003 года мы работаем с тем, что требует особого внимания: натуральными ингредиентами, свежестью и вашим доверием.</p><p>Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта. Чтобы вкус оставался таким, каким его задумали.</p><Link href='/contacts' className='text-link'>Обсудить сотрудничество</Link></div></Reveal></div>
          <div className='about-list' aria-label='Преимущества хладокомбината'>
            {ADVANTAGES.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * .07} className='about-row'>
              <span className='about-row-index'>{String(index + 1).padStart(2, '0')}</span>
              <Icon className='about-row-icon' size={30} strokeWidth={1.2} aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>)}
          </div>
          {page === 'about' && <Reveal className='about-stats'>
            {TRUST.map(stat => <div key={stat.label} className='about-stat'>
              <span className='about-stat-value'>{stat.value === '2003' ? stat.value : <CountUp value={Number(stat.value)} />}</span>
              <span className='about-stat-label'>{stat.label}</span>
            </div>)}
          </Reveal>}
        </section>}

        {page === 'about' && <>
          <section className='about-gallery' aria-label='RAMKAD: производство и продукция'>
            <figure className='about-gallery-item'>
              <Image src='/images/directions/marzo-products-on-ice.png' alt='Мороженое MARZO на льду' fill sizes='(max-width: 600px) 100vw, 40vw' />
              <figcaption>Мороженое MARZO</figcaption>
            </figure>
            <figure className='about-gallery-item'>
              <Image src='/images/herring/studio-ice.png' alt='Колотый лёд крупным планом' fill sizes='(max-width: 600px) 100vw, 25vw' />
              <figcaption>Холодовая цепь</figcaption>
            </figure>
            <figure className='about-gallery-item'>
              <Image src='/images/directions/iceberg-herring-on-ice.png' alt='Сельдь «Айсберг» на льду' fill sizes='(max-width: 600px) 100vw, 33vw' />
              <figcaption>Пресервы «Айсберг»</figcaption>
            </figure>
          </section>

          <section className='about-manifesto'>
            <Reveal><blockquote>
              <ManifestoWords />
              <cite>Принцип RAMKAD</cite>
            </blockquote></Reveal>
          </section>

          <section className='about-story section-pad'>
            <Reveal><SectionMark number='04' note='С 2003 года'>История</SectionMark></Reveal>
            <div className='about-story-grid'>
              <Reveal className='about-story-head'>
                <h2>Один завод.<br /><em>Две категории.</em></h2>
                <p>Мороженое и рыбные пресервы выходят из одного производства в Гудермесе — с общим стандартом холода.</p>
              </Reveal>
              <Reveal delay={.1}><ol className='about-timeline'>
                {STORY.map(item => <li key={item.mark}>
                  <span className='about-timeline-mark'>{item.mark}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>)}
              </ol></Reveal>
            </div>
          </section>

          <section className='about-process section-pad'>
            <Reveal><SectionMark number='05' note='От сырья до полки'>Процесс</SectionMark></Reveal>
            <div className='about-process-grid'>
              {PROCESS.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * .07} className='about-process-step'>
                <span className='about-process-index'>{String(index + 1).padStart(2, '0')}</span>
                <Icon size={28} strokeWidth={1.2} aria-hidden='true' />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>)}
            </div>
          </section>

          <section className='about-directions section-pad'>
            <Reveal><SectionMark number='06' note='Ассортимент'>Направления</SectionMark></Reveal>
            <div className='about-direction-list'>
              <Link className='about-direction-row' href='/catalog'>
                <span className='about-direction-index'>01</span>
                <div><h3>Мороженое</h3><p>MARZO и «Бурёнка»: рожки, эскимо, стаканчики и семейные форматы.</p></div>
                <span className='about-direction-meta'>{itemCount(PRODUCTS.length)}</span>
                <span className='about-direction-arrow'><ArrowUpRight size={18} aria-hidden='true' /></span>
              </Link>
              <Link className='about-direction-row' href='/catalog?department=fish#catalog-products'>
                <span className='about-direction-index'>02</span>
                <div><h3>Рыба и морепродукты</h3><p>Пресервы «Айсберг»: сельдь кусочками, филе и в масле.</p></div>
                <span className='about-direction-meta'>{itemCount(HERRING_PRODUCTS.length)}</span>
                <span className='about-direction-arrow'><ArrowUpRight size={18} aria-hidden='true' /></span>
              </Link>
            </div>
          </section>
          <AboutClosing />
        </>}

        {(page === 'home' || page === 'about') && <section id='news' className='news-section section-pad'>
          <Reveal><SectionMark number='04' note='События и производство'>Наши истории</SectionMark></Reveal>
          <Reveal><h2>Есть чем <em>поделиться.</em></h2></Reveal>
          <div className='news-list'>
            {NEWS.map((item, index) => <Reveal key={item.slug} className='news-row'>
              <Link className='news-row-link' href={`/news/${item.slug}/`}>
                <span className='news-row-index'>{String(index + 1).padStart(2, '0')}</span>
                <div className='news-row-media'><Image src={item.image} width={1038} height={678} alt='' loading='lazy' /></div>
                <div className='news-row-body'>
                  <div className='news-row-meta'><time dateTime={item.iso}>{item.date}</time><span>{item.type}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>
                <span className='news-row-cta'>Читать историю <ArrowUpRight size={16} aria-hidden /></span>
              </Link>
            </Reveal>)}
          </div>
          <Link className='text-link all-news-link' href='/news/'>Все новости <ArrowUpRight size={18} aria-hidden /></Link>
        </section>}
        {page === 'about' && <PartnershipFinal />}

        {(page === 'home' || page === 'contacts') && <section id='contacts' className='contacts-section' aria-labelledby='contacts-heading'><div className='map-section'>
            <video className='map-route' ref={map} data-map-mode={page === 'contacts' ? 'intro' : 'scroll'} src={page === 'contacts' ? asset('/videos/karta-intro.mp4') : asset('/videos/karta-scroll.mp4')} poster={asset('/images/map-preview.webp')} muted playsInline preload='auto' aria-label='Анимация маршрута к хладокомбинату в Гудермесе' />
            <div className='map-shade' />
            <div className='contact-panel-anchor'>
              <div className='contact-panel'>
                <p className='contact-card-lead'>Приезжайте в гости</p>
                <ContentHeading id='contacts-heading'>Контакты</ContentHeading>
                <address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address>
                <div className='contact-card-links'><a className='contact-phone' href='tel:+79389042323'>+7 (938) 904-23-23</a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div>
                <p className='opening-hours'>Пн–Сб, 08:00–18:00<br />Воскресенье — выходной</p>
                <p className='contact-legal'>{LEGAL.legalName} · ИНН {LEGAL.inn} · ОГРН {LEGAL.ogrn}</p>
              </div>
            </div>
            <span className='map-caption'>Гудермес, Чеченская Республика</span>
          </div>
        </section>}
        {page === 'contacts' && <section id='request' className='request-section section-pad'>
          <div className='request-layout'>
            <div className='request-copy'>
              <p className='request-eyebrow'>Заявка</p>
              <h2>Расскажите,<br /><em>что нужно.</em></h2>
              <p className='request-text'>Оставьте контакты — вернёмся с ассортиментом и условиями поставки. Работаем с магазинами, кафе и дистрибьюторами.</p>
              <div className='request-details'>
                <a href='tel:+79389042323'>+7 (938) 904-23-23</a>
                <a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a>
                <span>Пн–Сб, 08:00–18:00</span>
              </div>
            </div>
            <ContactRequest />
          </div>
        </section>}
        {page === 'product' && product && <ProductDetails product={product} />}
        {page === 'herring' && herringProduct && <HerringDetails product={herringProduct} />}
        {page === 'privacy' && <section className='legal-section section-pad'>
          <div className='legal-draft'>Черновик. Перед публикацией проверьте текст у юриста.</div>
          <p className='legal-eyebrow'>Правовая информация</p>
          <h1>Политика обработки<br /><em>персональных данных.</em></h1>
          <p className='legal-updated'>Редакция от 26 ноября 2026 года</p>
          <div className='legal-body'>
            <section>
              <h2>1. Оператор</h2>
              <p>{LEGAL.legalName}, ИНН {LEGAL.inn}, ОГРН {LEGAL.ogrn}, КПП {LEGAL.kpp}. Адрес: Чеченская Республика, г. Гудермес, 5-й км трассы Ростов–Баку. Электронная почта: <a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a>.</p>
            </section>
            <section>
              <h2>2. Какие данные мы получаем</h2>
              <p>Только те данные, которые вы оставляете сами: имя, телефон или адрес электронной почты и текст сообщения в форме заявки. Дополнительно сервер может обрабатывать обезличенные технические данные, необходимые для работы сайта.</p>
            </section>
            <section>
              <h2>3. Зачем мы их обрабатываем</h2>
              <p>Чтобы ответить на обращение, подобрать ассортимент и согласовать условия поставки. Мы не используем эти данные для рекламных рассылок без отдельного согласия.</p>
            </section>
            <section>
              <h2>4. Правовое основание</h2>
              <p>Обработка выполняется на основании вашего согласия, которое вы даёте, отмечая соответствующий пункт в форме заявки, в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
            </section>
            <section>
              <h2>5. Срок хранения и передача</h2>
              <p>Данные хранятся до достижения цели обращения или до отзыва согласия. Мы не передаём их третьим лицам, кроме случаев, прямо предусмотренных законом.</p>
            </section>
            <section>
              <h2>6. Ваши права</h2>
              <p>Вы можете запросить доступ к своим данным, уточнить или удалить их, а также отозвать согласие — напишите на <a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a>. Мы ответим в срок, установленный законом.</p>
            </section>
            <section>
              <h2>7. Файлы cookie</h2>
              <p>Сайт использует только технические механизмы, необходимые для его работы. Рекламные и аналитические cookie без вашего согласия не устанавливаются.</p>
            </section>
            <section>
              <h2>8. Изменения политики</h2>
              <p>Актуальная редакция всегда опубликована на этой странице. При изменении существенных условий мы обновим дату редакции.</p>
            </section>
          </div>
        </section>}
      </main>
      <footer className='landing-footer scene-section' onMouseMove={handleGlow}>
        <SceneBackdrop />
        <span className='ambient-glow' aria-hidden='true' />
        <div className='footer-top'>
          <Link href='/' className='footer-brand' aria-label='RAMKAD — на главную'><svg viewBox='0 0 1000 180' aria-hidden='true' focusable='false'><text x='0' y='165' textLength='1000' lengthAdjust='spacingAndGlyphs'>RAMKAD</text></svg><span className='footer-brand-rule' aria-hidden='true' /></Link>
          <div className='footer-contact'><a href='tel:+79389042323'>+7 (938) 904-23-23</a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div>
        </div>
        <div className='footer-bottom'>
          <span>© {new Date().getFullYear()} RAMKAD · {LEGAL.legalName}</span>
          <nav className='footer-links' aria-label='Навигация в подвале'>{NAV.map(([id, href, label]) => <Link key={id} href={href} aria-current={activePage === id ? 'page' : undefined}>{label}</Link>)}<Link href='/privacy'>Политика данных</Link></nav>
          <a href='#main'>В начало</a>
        </div>
      </footer>
    </div>
    {page !== 'contacts' && page !== 'privacy' && <div className='mobile-request-bar'>
      <a className='mobile-request-call' href='tel:+79389042323'>Позвонить</a>
      <Link className='mobile-request-submit' href='/contacts#request'>Оставить заявку <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden='true' /></Link>
    </div>}
  </div>;
}
