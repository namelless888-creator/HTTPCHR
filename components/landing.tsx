'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Snowflake, X } from 'lucide-react';
import { CATALOG } from '@/lib/catalog';

const NAV = [['hero', 'Главная'], ['catalog', 'Продукция'], ['about', 'О компании'], ['quality', 'Качество'], ['news', 'Новости'], ['contacts', 'Контакты']];
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
  const hero = useRef<HTMLElement>(null);
  const map = useRef<HTMLVideoElement>(null);
  const lastProduct = useRef<HTMLButtonElement | null>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const productY = useTransform(heroProgress, [0, 1], [0, 145]);
  const productRotate = useTransform(heroProgress, [0, 1], [-12, 2]);

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
    const seek = () => { if (reduce && Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - .1); };
    video.addEventListener('loadedmetadata', seek);
    if (reduce) { video.pause(); seek(); }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: .15 });
    observer.observe(video);
    return () => { observer.disconnect(); video.removeEventListener('loadedmetadata', seek); };
  }, [reduce]);

  const products = CATALOG.map((item, i) => ({ ...item, n: i + 1 })).filter(item => filter === 'Все вкусы' || category(item.n) === filter);
  const visible = expanded ? products : products.slice(0, 8);
  const product = selected === null ? null : CATALOG[selected - 1];

  return <div className='ramcad'>
    <motion.div className='reading-progress' style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <aside className='rail'>
      <a href='#hero' className='brand' aria-label='RAMCAD — на главную'><Snowflake strokeWidth={1.3} /><span>RAMCAD<small>ХЛАДОКОМБИНАТ</small></span></a>
      <button ref={menuToggle} className='mobile-toggle' aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls='main-navigation' onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <nav id='main-navigation' className={menu ? 'rail-nav is-open' : 'rail-nav'} aria-label='Основная навигация'>
        {NAV.map(([id, label], i) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setMenu(false)}><span>0{i + 1}</span>{label}<i /></a>)}
        <a className='mobile-phone' href='tel:+79389042323'>+7 (938) 904-23-23</a>
      </nav>
      <div className='rail-bottom'><span className='status-dot' />Сделано в Чечне<p>С заботой о вкусе.<br />С уважением к традициям.</p><a href='mailto:oooiceberg95@mail.ru'>Напишите нам <ArrowUpRight size={14} /></a><span className='rail-year'>EST. 2003</span></div>
    </aside>

    <div className='page-content'>
      <header className='top-bar'><span>ХОЛОД СОХРАНЯЕТ. ВКУС ОБЪЕДИНЯЕТ.</span><a href='tel:+79389042323'>+7 (938) 904-23-23 <ArrowUpRight size={16} /></a></header>
      <main id='main'>
        <section id='hero' className='hero-section' ref={hero}>
          <div className='hero-text'><p className='eyebrow'><span />Хладокомбинат нового времени</p><h1>Создаём вкус.<br /><em>Сохраняем</em><br />свежесть.</h1><p className='hero-description'>От любимого пломбира до морских деликатесов.<br className='desktop-break' /> Всё, что мы делаем, начинается с качества.</p><a className='pill pill-dark' href='#catalog'>Открыть коллекцию <ArrowUpRight size={20} /></a><a className='hero-scroll' href='#directions'><span><ArrowDown size={17} /></span>Листайте, чтобы познакомиться</a></div>
          <div className='hero-art' aria-label='Фирменное мороженое MARZO'><span className='hero-orbit orbit-one' /><span className='hero-orbit orbit-two' /><span className='hero-word' aria-hidden>MARZO</span><motion.div className='hero-pack pack-back' style={reduce ? undefined : { y: productY, rotate: productRotate }}><Image src='/images/products/08.png' alt='MARZO — фисташковое эскимо в тёмном шоколаде' width={311} height={573} priority /></motion.div><motion.div className='hero-pack pack-front' style={reduce ? undefined : { y: productY }}><Image src='/images/products/04.png' alt='MARZO — солёная карамель в вафельном рожке' width={307} height={577} priority /></motion.div><div className='hero-seal'><Snowflake size={26} strokeWidth={1} /><span>Настоящий вкус<br />настоящих продуктов</span></div><span className='art-caption'>КОЛЛЕКЦИЯ MARZO · ВКУС ДЕТСТВА, НОВЫЙ ВЗГЛЯД</span></div>
          <div className='hero-bottom'><span>С 2003 года <i>сохраняем главное</i></span><span>Мороженое <b>·</b> Рыба <b>·</b> Полуфабрикаты</span><Snowflake size={22} strokeWidth={1} /></div>
        </section>

        <section id='directions' className='directions-section section-pad'>
          <SectionTitle number='01' note='Три направления. Одна философия.'>Наше дело</SectionTitle>
          <Reveal><h2>Разные продукты.<br /><em>Одинаково высокие стандарты.</em></h2></Reveal>
          <div className='direction-list'>
            {[['01', 'Мороженое', 'Маленькое счастье в каждом вкусе', 'Пломбир, эскимо, рожки и фруктовый лёд под брендом MARZO.', 'catalog', 'ice'], ['02', 'Рыба и морепродукты', 'Свежесть, которую важно сохранить', 'Отборное сырьё, бережная переработка и собственный холод.', 'fish', 'fish'], ['03', 'Полуфабрикаты', 'Больше времени для самого важного', 'Удобные решения для вашего стола. Ассортимент уточняйте у нашей команды.', 'ready-to-eat', 'ready']].map(([n, title, sub, text, href, type]) => <Reveal key={n}><a href={`#${href}`} className={`direction-row direction-${type}`}><span className='direction-number'>{n}</span><div><h3>{title}</h3><span>{sub}</span></div><p>{text}</p><span className='circle-arrow'><ArrowUpRight /></span></a></Reveal>)}
          </div>
        </section>

        <section id='catalog' className='catalog-section section-pad'>
          <SectionTitle number='02' note='Вкус, к которому хочется возвращаться'>Коллекция MARZO</SectionTitle>
          <div className='section-heading'><Reveal><h2>Выберите своё<br /><em>маленькое счастье.</em></h2></Reveal><p>Знакомые вкусы и неожиданные сочетания.<br />Найдётся тот самый — ваш.</p></div>
          <div className='catalog-toolbar'><div className='filter-tabs' role='group' aria-label='Категории мороженого'>{FILTERS.map(label => <button key={label} aria-pressed={filter === label} className={filter === label ? 'selected' : ''} onClick={() => { setFilter(label); setExpanded(false); }}>{label}</button>)}</div><span aria-live='polite'>{flavorCount(products.length)}</span></div>
          <motion.div className='product-grid' layout={!reduce}>
            {visible.map(item => <motion.button layout={!reduce} key={item.n} className='product-card' onClick={event => { lastProduct.current = event.currentTarget; setSelected(item.n); }} initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : .35 }} aria-label={`Подробнее: ${item.name}`}><div className='product-visual'><span className='product-category'>{category(item.n)}</span>{item.hot && <span className='product-label'>Любимый вкус</span>}<Image src={item.src} alt={item.name} width={600} height={800} loading='lazy' /><span className='product-open'><ArrowUpRight size={20} /></span></div><div className='product-info'><span>MARZO / {String(item.n).padStart(2, '0')}</span><h3>{item.name.replace(/^MARZO\s*/, '')}</h3></div></motion.button>)}
          </motion.div>
          {products.length > 8 && <button className='pill pill-outline show-more' onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть коллекцию' : `Все ${products.length} вкусов`}<ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} /></button>}
          <div className='catalog-note'><Snowflake size={17} />От производства до вашего стола — под контролем холода.</div>
        </section>

        <section id='about' className='about-section section-pad'>
          <SectionTitle number='03' note='Гудермес, Чеченская Республика'>О компании</SectionTitle>
          <div className='about-layout'><Reveal><h2>Большое дело.<br /><em>Простые ценности.</em></h2><p className='about-intro'>Мы верим: хорошим продуктам<br />не нужны громкие обещания.</p></Reveal><Reveal delay={.15}><div className='about-copy'><p>RAMCAD — хладокомбинат в Чеченской Республике. С 2003 года мы работаем с тем, что требует особого внимания: натуральными ингредиентами, свежестью и вашим доверием.</p><p>Три отдельных цеха, собственные холодильные камеры и свой температурный режим для каждого продукта. Чтобы вкус оставался таким, каким его задумали.</p><a href='#quality' className='text-link'>Наш подход к качеству <ArrowDown size={17} /></a></div></Reveal></div>
          <div className='about-statistics'><Reveal><div><strong>2003</strong><span>год, когда началась наша история</span></div></Reveal><Reveal delay={.1}><div><strong>3<span> цеха</span></strong><span>независимых направления производства</span></div></Reveal><Reveal delay={.2}><div><strong>36<span> вкусов</span></strong><span>в коллекции мороженого</span></div></Reveal></div>
          <div className='brand-strip' aria-hidden><span>ЗАБОТА В ДЕТАЛЯХ</span><Snowflake /><span>КАЧЕСТВО В ГЛАВНОМ</span><Snowflake /><span>ВКУС В КАЖДОМ МОМЕНТЕ</span></div>
        </section>

        <section id='quality' className='quality-section section-pad'>
          <SectionTitle number='04' note='Сохраняем то, что имеет значение'>Философия качества</SectionTitle>
          <div className='quality-layout'><div className='quality-sticky'><Reveal><h2>Свежесть —<br /><em>в деталях.</em></h2><p>За каждым продуктом — люди,<br />технологии и внимание к мелочам.</p></Reveal><div className='cold-mark'><Snowflake strokeWidth={.7} /><span>НЕПРЕРЫВНАЯ<br />ХОЛОДОВАЯ ЦЕПЬ</span></div></div><div className='quality-steps'>{[['01', 'Начинаем с хорошего сырья', 'Внимательно выбираем ингредиенты. Ведь настоящий вкус начинается задолго до производства.'], ['02', 'У каждого продукта — свой холод', 'Отдельные холодильные камеры для мороженого, рыбы и полуфабрикатов. Точные параметры температуры и влажности.'], ['03', 'Бережно сохраняем результат', 'Контролируем условия на этапах производства и хранения. Качество складывается из ежедневной работы.']].map(([n, title, text]) => <Reveal key={n}><article className='quality-step'><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div><Check size={18} /></article></Reveal>)}</div></div>
        </section>

        <section className='other-section section-pad' id='fish'><SectionTitle number='05' note='Больше, чем мороженое'>Другие направления</SectionTitle><div className='other-grid'><Reveal><article><span className='line-illustration' aria-hidden>≈</span><p className='eyebrow'>Свежесть моря</p><h2>Рыба и<br /><em>морепродукты.</em></h2><p>Бережная переработка и хранение в отдельном цехе. Узнайте о доступной продукции и условиях поставки у нашей команды.</p><a className='pill pill-outline' href='#contacts'>Узнать ассортимент <ArrowUpRight size={18} /></a></article></Reveal><Reveal delay={.15}><article id='ready-to-eat'><span className='line-illustration' aria-hidden>⌁</span><p className='eyebrow'>Для вашего стола</p><h2>Время —<br /><em>для близких.</em></h2><p>Полуфабрикаты для простых домашних решений. Свяжитесь с нами, чтобы уточнить ассортимент и возможности сотрудничества.</p><a className='pill pill-outline' href='#contacts'>Обсудить поставку <ArrowUpRight size={18} /></a></article></Reveal></div></section>

        <section id='news' className='news-section section-pad'><SectionTitle number='06' note='Из жизни компании · архив 2024'>Наши истории</SectionTitle><Reveal><h2>Есть чем <em>поделиться.</em></h2></Reveal><div className='news-grid'>{NEWS.map(item => <Reveal key={item.slug}><a className='news-card' href={`https://icechr.ru/${item.slug}`} target='_blank' rel='noopener noreferrer'><div className='news-image'><Image src={`/images/products/${String(item.image).padStart(2, '0')}.png`} width={600} height={800} alt='' loading='lazy' /><span>{item.type}</span><ArrowUpRight size={24} /></div><time dateTime={item.iso}>{item.date}</time><h3>{item.title}</h3><p>{item.text}</p><span className='news-source'>Читать на icechr.ru <ArrowUpRight size={14} /></span></a></Reveal>)}</div></section>

        <section id='contacts' className='contacts-section'><div className='contact-intro section-pad'><SectionTitle number='07' note='Открыты к сотрудничеству'>Всегда на связи</SectionTitle><Reveal><h2>Хорошее начинается<br /><em>со знакомства.</em></h2></Reveal><div className='contact-intro-bottom'><p>Розничные сети, магазины и партнёры —<br />давайте создавать хороший вкус вместе.</p><a className='pill pill-light' href='mailto:oooiceberg95@mail.ru?subject=Сотрудничество%20с%20RAMCAD'>Обсудить сотрудничество <ArrowUpRight size={20} /></a></div></div><div className='map-section'><video ref={map} src='/videos/karta_animation.mp4' muted playsInline loop preload='metadata' aria-label='Видео маршрута к хладокомбинату в Гудермесе' /><div className='map-shade' /><div className='contact-card'><p className='eyebrow'><span />Приезжайте в гости</p><h3>Здесь рождается<br />любимый вкус.</h3><address>Чеченская Республика, г. Гудермес,<br />5-й км трассы Ростов–Баку</address><a className='contact-phone' href='tel:+79389042323'>+7 (938) 904-23-23 <ArrowUpRight size={20} /></a><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a><p className='opening-hours'>Пн–Сб · 08:00–18:00<br />Воскресенье — выходной</p><a className='text-link' href='https://yandex.ru/maps/?text=Гудермес%205-й%20км%20трассы%20Ростов-Баку' target='_blank' rel='noopener noreferrer'>Проложить маршрут <ArrowUpRight size={17} /></a></div><span className='map-caption'>ГУДЕРМЕС / RAMCAD</span></div></section>
      </main>
      <footer className='landing-footer'><a href='#hero' className='footer-brand'>RAMCAD<span>СОХРАНЯЕМ ГЛАВНОЕ.</span></a><div><span>© {new Date().getFullYear()} RAMCAD</span><a href='#hero'>В начало <ArrowUpRight size={17} /></a></div></footer>
    </div>

    <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><Dialog.Portal><Dialog.Overlay className='product-overlay' /><Dialog.Content className='product-dialog' onCloseAutoFocus={event => { event.preventDefault(); lastProduct.current?.focus({ preventScroll: true }); }}><Dialog.Close className='dialog-close' aria-label='Закрыть товар'><X size={22} /></Dialog.Close>{product && <><div className='dialog-image'><Image src={product.src} width={600} height={800} alt={product.name} /></div><div className='dialog-copy'><p className='eyebrow'>Коллекция MARZO</p><Dialog.Title>{product.name}</Dialog.Title><Dialog.Description>Любимый вкус для маленьких радостей. Уточните состав, наличие и условия оптовой поставки у нашей команды.</Dialog.Description><a href='#contacts' className='pill pill-dark' onClick={() => setSelected(null)}>Узнать о поставке <ArrowRight size={18} /></a></div></>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}
