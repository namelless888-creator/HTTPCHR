import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Mail, Snowflake } from 'lucide-react';
import { PRODUCTS, productHref, type Product } from '@/lib/products';
import { SceneBackdrop } from '@/components/scene-backdrop';

const productTitle = (product: Product) => product.name.replace(/^MARZO\s+/i, '');
const stageStyle = (product: Product): CSSProperties => ({
  '--product-stage-background': product.n < 19 ? '#cecfda' : product.n === 19 ? '#c9cdde' : '#c9cddd',
} as CSSProperties);

export function ProductDetails({ product }: { product: Product }) {
  const related = [
    ...PRODUCTS.filter(item => item.n !== product.n && item.category === product.category),
    ...PRODUCTS.filter(item => item.n !== product.n && item.category !== product.category),
  ].slice(0, 3);
  const facts = [
    ['Коллекция', product.brand],
    ['Формат', product.category],
    ['Вкус', product.taste],
    ...(product.weight ? [['Масса нетто', product.weight]] : []),
  ];

  return <article className='product-details'>
    <nav className='product-breadcrumbs' aria-label='Хлебные крошки'>
      <Link href='/'>Главная</Link><ChevronRight size={12} aria-hidden='true' />
      <Link href='/catalog'>Каталог</Link><ChevronRight size={12} aria-hidden='true' />
      <span aria-current='page'>{productTitle(product)}</span>
    </nav>

    <div className='product-detail-layout scene-section'>
      <SceneBackdrop priority />
      <div className='product-showcase'>
        <div className='showcase-meta'><strong>{product.brand}</strong><span>{String(product.n).padStart(2, '0')} / {PRODUCTS.length}</span></div>
        <span className='podium-shadow' aria-hidden='true' />
        <span className='product-contact-shadow' aria-hidden='true' />
        <Image className='product-layer product-layer-fade' src={product.src} alt={product.name} width={600} height={800} unoptimized priority />
        <p className='showcase-caption'><Snowflake size={18} strokeWidth={1.5} aria-hidden='true' /><span>Сохраняем любимый вкус</span></p>
      </div>

      <div className='product-detail-copy'>
        <div className='pd-card'>
          <p className='product-detail-eyebrow'>{product.brand} · {product.category}</p>
          <h1>{productTitle(product)}</h1>
          <p className='product-detail-intro'>{product.description}</p>
        </div>

        <div className='pd-card product-price-panel'>
          <p>Для вашего магазина, кафе или сети</p>
          <Link className='product-price-button' href='/contacts'>Узнать оптовую цену <ArrowUpRight size={21} strokeWidth={1.5} aria-hidden='true' /></Link>
          <a className='product-sales-phone' href='tel:+79389042323'>+7 (938) 904-23-23</a>
        </div>

        <dl className='product-facts'>
          {facts.map(([label, value]) => <div className='pd-card product-fact-card' key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>

        <div className='product-information'>
          <details className='pd-card' open>
            <summary>О продукте <ChevronDown size={17} strokeWidth={1.5} aria-hidden='true' /></summary>
            <div><p>{product.description}</p><p>Состав и пищевая ценность — на упаковке. Условия хранения и срок годности указаны производителем.</p></div>
          </details>
          <details className='pd-card'>
            <summary>Заказ и поставка <ChevronDown size={17} strokeWidth={1.5} aria-hidden='true' /></summary>
            <div><p>Свяжитесь с отделом продаж: поможем выбрать ассортимент и обсудим объём заказа, стоимость и условия поставки.</p><a href='mailto:oooiceberg95@mail.ru'>oooiceberg95@mail.ru</a></div>
          </details>
        </div>
        <Link className='product-back-link' href='/catalog'><ArrowLeft size={16} strokeWidth={1.5} aria-hidden='true' /> Весь каталог</Link>
      </div>
    </div>

    <section className='product-related' aria-labelledby='product-related-title'>
      <div className='product-related-heading'><div><p className='product-detail-eyebrow'>Ещё немного хорошего</p><h2 id='product-related-title'>Найдите свой <em>вкус.</em></h2></div><Link href='/catalog'>Весь каталог</Link></div>
      <div className='product-related-grid'>
        {related.map(item => <Link href={productHref(item)} key={item.id} className='product-related-card'>
          <div className='product-related-visual' style={stageStyle(item)}><span>{item.category}</span><Image src={item.src} alt={item.name} width={600} height={800} unoptimized sizes='(max-width: 700px) 85vw, 30vw' /><span className='product-related-arrow'><ArrowUpRight size={21} strokeWidth={1.5} aria-hidden='true' /></span></div>
          <div className='product-related-caption'><h3>{productTitle(item)}</h3><span>{item.brand}</span></div>
        </Link>)}
      </div>
    </section>

    <section className='product-sales-note scene-section' aria-labelledby='product-sales-title'>
      <SceneBackdrop />
      <div><p className='product-detail-eyebrow'>Для партнёров RAMCAD</p><h2 id='product-sales-title'>Хороший вкус —<br /><em>хорошее начало.</em></h2><p>Соберём ассортимент для вашего бизнеса. Обсудим сотрудничество?</p></div>
      <div className='product-sales-actions'><Link href='/contacts'>Связаться с нами <ArrowRight size={21} strokeWidth={1.5} aria-hidden='true' /></Link><a href='mailto:oooiceberg95@mail.ru'><Mail size={15} strokeWidth={1.5} aria-hidden='true' />oooiceberg95@mail.ru</a></div>
    </section>
  </article>;
}
