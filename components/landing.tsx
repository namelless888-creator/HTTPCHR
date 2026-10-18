'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ArrowUpRight, ChevronDown, Handshake, Menu, Snowflake, X } from 'lucide-react';
import { CATALOG } from '@/lib/catalog';

const NAV = [['hero', 'Главная'], ['catalog', 'Каталог'], ['about', 'О компании'], ['contacts', 'Контакты']];
const FILTERS = ['Все вкусы', 'Рожки', 'Эскимо', 'Стаканчики', 'Фруктовый лёд', 'Для семьи'];
const CONES = [2, 4, 6, 7, 9, 18, 19, 20];
const ICE = [3, 10, 13, 14, 28, 36];
const FAMILY = [16, 17, 32, 33, 34, 35];
const category = (n: number) => CONES.includes(n) ? 'Рожки' : ICE.includes(n) ? 'Фруктовый лёд' : FAMILY.includes(n) ? 'Для семьи' : [23, 24, 25].includes(n) ? 'Стаканчики' : 'Эскимо';
const flavorCount = (n: number) => `${n} ${n > 10 && n < 15 ? 'вкусов' : n % 10 === 1 ? 'вкус' : n % 10 >= 2 && n % 10 <= 4 ? 'вкуса' : 'вкусов'}`;
const NEWS = [
  { date: '06.03.2024', iso: '2024-03-06', type: 'События', title: 'Когда хороший вкус объединяет', text: 'MARZO — партнёр интеллектуального вечера «Недвижимый квиз».', slug: '2024/03/06/estate-quiz/', image: 4 },
  { date: '29.02.2024', iso: '2024-02-29', type: 'Партнёрство', title: 'Кино, друзья и любимое мороженое', text: 'Уютный кинопросмотр вместе с MARZO и Lancman School.', slug: '2024/02/29/marzo-and-lancman/', image: 11 },
  { date: '18.02.2024', iso: '2024-02-18', type: 'Новый вкус', title: 'Маленький кусочек большого лета', text: 'Фруктовый лёд со вкусом дыни в коллекции MARZO.', slug: '2024/02/18/new-icecream/', image: 3 },
];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

function SectionTitle({ number, children, note }: { number: string; children: React.ReactNode; note: string }) {
  return <div className='section-kicker'><span>{number} / {children}</span><span>{note}</span></div>;
}

export function Landing() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState('hero');
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Все вкусы');
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const map = useRef<HTMLVideoElement>(null);
  const lastProduct = useRef<HTMLButtonElement | null>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px' });
    NAV.forEach(([id]) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-ready'); revealObserver.observe(el); });
    return () => { observer.disconnect(); revealObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenu(false); menuToggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);

  useEffect(() => {
    const video = map.current;
    if (!video) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      video.pause();
      if (!Number.isFinite(video.duration) || video.seeking) return;
      const rect = video.getBoundingClientRect();
      const progress = reduce ? 1 : Math.min(1, Math.max(0,
        (window.innerHeight - rect.top) / Math.min(rect.height, window.innerHeight)));
      const time = progress * Math.max(0, video.duration - .05);
      if (Math.abs(video.currentTime - time) > .04) video.currentTime = time;
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
  }, [reduce]);

  const products = CATALOG.map((item, i) => ({ ...item, n: i + 1 })).filter(item => filter === 'Все вкусы' || category(item.n) === filter);
  const visible = expanded ? products : products.slice(0, 8);
  const product = selected === null ? null : CATALOG[selected - 1];

  return <div className='ramcad'>
    <motion.div className='reading-progress' style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <header className='main-header'>
      <a href='#hero' className='header-brand' aria-label='RAMCAD — на главную'>RAMCAD</a>
      <nav id='main-navigation' className={menu ? 'header-links is-open' : 'header-links'} aria-label='Основная навигация'>
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
      <a className='header-phone' href='tel:+79389042323'>8 (938) 904-23-23</a>
      <button ref={menuToggle} className='mobile-toggle header-menu-toggle' aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls='main-navigation' onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </header>

    <div className='page-content'>
      <main id='main'>
        <section id='hero' className='reference-hero'>
          <div className='reference-hero-photo' role='img' aria-label='Мороженое MARZO: солёная карамель, эскимо и шоколадный пломбир на ледяной поверхности'>
            <Image src='/images/hero-reference.png' alt='' width={1536} height={1024} unoptimized priority />
          </div>
          <div className='reference-hero-copy'><h1>Создаём вкус.<br />Сохраняем свежесть.</h1><a className='pill pill-dark reference-hero-button' href='#catalog'>Смотреть каталог <ArrowRight size={27} /></a></div>
        </section>

        <section id='directions' className='directions-section section-pad'>
          <Reveal className='direction-heading'>
            <h2>Эксперты в холоде.<br />Мастера вкуса.</h2>
            <p>Производим мороженое.<br />Поставляем рыбу и морепродукты.</p>
          </Reveal>
          <div className='direction-cards'>
            <Reveal>
              <a href='#catalog' className='direction-card'>
                <div className='direction-photo direction-photo-ice' role='img' aria-label='Вафельный рожок с мороженым и эскимо в шоколадной глазури'>
                  <Image src='/images/directions/reference.png' alt='' width={1536} height={1024} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <h3>Мороженое</h3>
                  <p>Натуральные ингредиенты в традиционных рецептах с 2003 года.</p>
                  <span className='direction-card-link'>Смотреть продукцию <ArrowUpRight size={17} /><i /></span>
                </div>
              </a>
            </Reveal>
            <Reveal delay={.12}>
              <a href='#fish' className='direction-card'>
                <div className='direction-photo direction-photo-fish' role='img' aria-label='Свежая рыба и филе лосося на льду'>
                  <Image src='/images/directions/reference.png' alt='' width={1536} height={1024} unoptimized />
                </div>
                <div className='direction-card-copy'>
                  <h3>Рыба и морепродукты</h3>
                  <p>Надёжные поставки для вашей сети.</p>
                  <span className='direction-card-link'>Узнать ассортимент <ArrowUpRight size={17} /><i /></span>
                </div>
              </a>
            </Reveal>
          </div>
          <Reveal delay={.18}>
            <div className='direction-partnership'>
              <Handshake className='partnership-icon' size={48} strokeWidth={1.2} aria-hidden />
              <div><h3>Для магазинов, ресторанов и дистрибьюторов</h3><p>Стабильные поставки. Гибкие условия. Личный менеджер.</p></div>
              <a href='#contacts' className='pill partnership-button'>Сотрудничать <ArrowRight size={20} /></a>
            </div>
          </Reveal>
        </section>

        <section id='catalog' className='catalog-section section-pad'>
          <SectionTitle number='02' note='Вкус, к которому хочется возвращаться'>Коллекция MARZO</SectionTitle>
          <div className='section-heading'><Reveal><h2>Выберите своё<br /><em>маленькое счастье.</em></h2></Reveal><p>Знакомые вкусы и неожиданные сочетания.<br />Найдётся тот самый — ваш.</p></div>
          <div className='catalog-toolbar'><div className='filter-tabs' role='group' aria-label='Категории мороженого'>{FILTERS.map(label => <button key={label} aria-pressed={filter === label} className={filter === label ? 'selected' : ''} onClick={() => { setFilter(label); setExpanded(false); }}>{label}</button>)}</div><span aria-live='polite'>{flavorCount(products.length)}</span></div>
          <motion.div className='product-grid' layout={!reduce}>
            {visible.map(item => <motion.button layout={!reduce} key={item.n} className='product-card' onClick={event => { lastProduct.current = event.currentTarget; setSelected(item.n); }} initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : .35 }} aria-label={`Подробнее: ${item.name}`}><div className='product-visual'><span className='product-category'>{category(item.n)}</span>{item.hot && <span className='product-label'>Любимый вкус</span>}<Image src={item.src} alt={item.name} width={600} height={800} unoptimized loading='lazy' /><span className='product-open'><ArrowUpRight size={20} /></span></div><div className='product-info'><span>MARZO / {String(item.n).padStart(2, '0')}</span><h3>{item.name.replace(/^MARZO\s*/, '')}</h3></div></motion.button>)}
          </motion.div>
          {products.length > 8 && <button className='pill pill-outline show-more' onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть коллекцию' : `Все ${products.length} вкусов`}<ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} /></button>}
          <div className='catalog-note'><Snowflake size={17} />От производства до вашего стола — под контролем холода.</div>
        </section>

        <section id='about' className='about-section section-pad'>
          <SectionTitle number='03' note='Гудермес, Чеченская Республика'>О компании</SectionTitle>
          <div className='about-layout'><Reveal><h2>Большое дело.<br /><em>Простые ценности.</em></h2><p className='about-intro'>Мы верим: хорошим продуктам<br />не нужны громкие обещания.</p></Reveal><Reveal delay={.15}><div className='about-copy'><p>RAMCAD — хладокомбинат в Чеченской Республике. С 2003 года мы работаем с тем, что требует особого внимания: натуральными ингредиентами, свежестью и вашим доверием.</p><p>Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта. Чтобы вкус оставался таким, каким его задумали.</p><a href='#contacts' className='text-link'>Обсудить сотрудничество <ArrowUpRight size={17} /></a></div></Reveal></div>
          <div className='about-statistics'><Reveal><div><strong>2003</strong><span>год, когда началась наша история</span></div></Reveal><Reveal delay={.1}><div><strong>3<span> цеха</span></strong><span>независимых направления производства</span></div></Reveal><Reveal delay={.2}><div><strong>36<span> вкусов</span></strong><span>в коллекции мороженого</span></div></Reveal></div>
          <div className='brand-strip' aria-hidden><span>ЗАБОТА В ДЕТАЛЯХ</span><Snowflake /><span>КАЧЕСТВО В ГЛАВНОМ</span><Snowflake /><span>ВКУС В КАЖДОМ МОМЕНТЕ</span></div>
        </section>

        <section className='other-section section-pad' id='fish'><SectionTitle number='04' note='Больше, чем мороженое'>Другие направления</SectionTitle><div className='other-grid'><Reveal><article><span className='line-illustration' aria-hidden>≈</span><p className='eyebrow'>Свежесть моря</p><h2>Рыба и<br /><em>морепродукты.</em></h2><p>Бережная переработка и хранение в отдельном цехе. Узнайте о доступной продукции и условиях поставки у нашей команды.</p><a className='pill pill-outline' href='#contacts'>Узнать ассортимент <ArrowUpRight size={18} /></a></article></Reveal><Reveal delay={.15}><article id='ready-to-eat'><span className='line-illustration' aria-hidden>⌁</span><p className='eyebrow'>Для вашего стола</p><h2>Время —<br /><em>для близких.</em></h2><p>Полуфабрикаты для простых домашних решений. Свяжитесь с нами, чтобы уточнить ассортимент и возможности сотрудничества.</p><a className='pill pill-outline' href='#contacts'>Обсудить поставку <ArrowUpRight size={18} /></a></article></Reveal></div></section>

        <section id='news' className='news-section section-pad'><SectionTitle number='05' note='Из жизни компании · архив 2024'>Наши истории</SectionTitle><Reveal><h2>Есть чем <em>поделиться.</em></h2></Reveal><div className='news-grid'>{NEWS.map(item => <Reveal key={item.slug}><a className='news-card' href={`https://icechr.ru/${item.slug}`} target='_blank' rel='noopener noreferrer'><div className='news-image'><Image src={`/images/products/${String(item.image).padStart(2, '0')}.png`} width={600} height={800} unoptimized alt='' loading='lazy' /><span>{item.type}</span><ArrowUpRight size={24} /></div><time dateTime={item.iso}>{item.date}</time><h3>{item.title}</h3><p>{item.text}</p><span className='news-source'>Читать на icechr.ru <ArrowUpRight size={14} /></span></a></Reveal>)}</div></section>

        <section id='contacts' className='contacts-section'><div className='contact-intro section-pad'><SectionTitle number='06' note='Открыты к сотрудничеству'>Всегда на связи</SectionTitle><Reveal><h2>Хорошее начинается<br /><em>со знакомства.</em></h2></Reveal><div className='contact-intro-bottom'><p>Розничные сети, магазины и партнёры —<br />давайте создавать хороший вкус вместе.</p><a className='pill pill-light' href='mailto:oooiceberg95@mail.ru?subject=Сотрудничество%20с%20RAMCAD'>Обсудить сотрудничество <ArrowUpRight size={20} /></a></div></div><div className='map-section'>
            <video className='map-route' ref={map} src='/videos/karta_animation.mp4' muted playsInline preload='auto' aria-label='Видео маршрута к хладокомбинату в Гудермесе' /><div className='map-shade' /><div className='contact-card'><p className='eyebrow'><span />Приезжайте в гости</p><h3>Здесь рождается<br />любимый вкус.</h3><address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address><a className='contact-phone' href='tel:+79389042323'>+7 (938) 904-23-23 <ArrowUpRight size={20} /></a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a><p className='opening-hours'>Пн–Сб · 08:00–18:00<br />Воскресенье — выходной</p></div><span className='map-caption'>ГУДЕРМЕС / RAMCAD</span></div></section>
      </main>
      <footer className='landing-footer'><a href='#hero' className='footer-brand'>RAMCAD<span>СОХРАНЯЕМ ГЛАВНОЕ.</span></a><div><span>© {new Date().getFullYear()} RAMCAD</span><a href='#hero'>В начало <ArrowUpRight size={17} /></a></div></footer>
    </div>

    <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><Dialog.Portal><Dialog.Overlay className='product-overlay' /><Dialog.Content className='product-dialog' onCloseAutoFocus={event => { event.preventDefault(); lastProduct.current?.focus({ preventScroll: true }); }}><Dialog.Close className='dialog-close' aria-label='Закрыть товар'><X size={22} /></Dialog.Close>{product && <><div className='dialog-image'><Image src={product.src} width={600} height={800} unoptimized alt={product.name} /></div><div className='dialog-copy'><p className='eyebrow'>Коллекция MARZO</p><Dialog.Title>{product.name}</Dialog.Title><Dialog.Description>Любимый вкус для маленьких радостей. Уточните состав, наличие и условия оптовой поставки у нашей команды.</Dialog.Description><a href='#contacts' className='pill pill-dark' onClick={() => setSelected(null)}>Узнать о поставке <ArrowRight size={18} /></a></div></>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}
