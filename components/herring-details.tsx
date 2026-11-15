'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight, X } from 'lucide-react';
import { herringSceneStyle, type HerringProduct } from '@/lib/herring';

type GalleryView = 'scene' | 'pack' | 'fish';
const GALLERY: { id: GalleryView; label: string }[] = [
  { id: 'scene', label: 'Рыба и упаковка на льду' },
  { id: 'pack', label: 'Упаковка крупным планом' },
  { id: 'fish', label: 'Рыба на льду крупным планом' },
];

function PhotoComposition({ product, className, withBackdrop = false }: { product: HerringProduct; className: string; withBackdrop?: boolean }) {
  return <div className={className} aria-hidden='true'>
    {withBackdrop && <Image className='herring-composition-backdrop' src='/images/herring/studio-ice.webp' alt='' width={1774} height={887} unoptimized />}
    <div className='herring-pack'>
      <Image className='herring-pack-base' src='/images/herring/packaging-tub.webp' alt='' width={1254} height={1254} unoptimized />
      <Image className='herring-pack-label' src={product.labelImage} alt='' width={1401} height={1401} unoptimized />
      <span className='herring-pack-sheen' />
    </div>
    <Image className='herring-photo-fish' src={product.fishImage} alt='' width={2048} height={2048} unoptimized />
  </div>;
}

export function HerringDetails({ product }: { product: HerringProduct }) {
  const [gallery, setGallery] = useState<GalleryView>('scene');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const name = `${product.title} ${product.subtitle}`;

  const facts: [string, string][] = [
    ['Бренд', product.brand],
    ['Формат', product.format],
    ['Масса нетто', product.weight],
  ];

  return <article className='herring-details' data-gallery={gallery} style={herringSceneStyle(product)}>
    <nav className='product-breadcrumbs' aria-label='Хлебные крошки'>
      <Link href='/'>Главная</Link><ChevronRight size={12} aria-hidden='true' />
      <Link href='/#directions'>Рыба и морепродукты</Link><ChevronRight size={12} aria-hidden='true' />
      <span aria-current='page'>{name}</span>
    </nav>

    <div className='herring-layout scene-section'>
      <Image className='herring-ice-backdrop' src='/images/herring/studio-ice.webp' alt='' width={1774} height={887} unoptimized priority fetchPriority='high' />
      <PhotoComposition product={product} className='herring-composition herring-composition-desktop' />
      <span className='herring-wave-pattern' aria-hidden='true' />

      <div className='herring-grid'>
        <section className='herring-gallery' aria-label='Фотографии товара'>
          <p className='herring-gallery-brand'>{product.brand.toUpperCase()}</p>
          <PhotoComposition product={product} className='herring-composition herring-composition-mobile' withBackdrop />
          <p className='sr-only' aria-live='polite'>{GALLERY.find(g => g.id === gallery)?.label}</p>
          <div className='herring-gallery-dots' role='group' aria-label='Выбрать изображение товара'>
            {GALLERY.map(g => <button key={g.id} type='button' aria-pressed={gallery === g.id} className={gallery === g.id ? 'is-active' : ''} aria-label={g.label} onClick={() => setGallery(g.id)}><span /></button>)}
          </div>
        </section>

        <section className='herring-info' aria-labelledby='herring-title'>
          <div className='herring-card herring-intro'>
            <p className='herring-eyebrow'>{product.brand.toUpperCase()} · {product.category.toUpperCase()}</p>
            <h1 id='herring-title'><span className='herring-title-lead'>{product.title}</span><span className='herring-title-detail'>{product.subtitle}</span></h1>
            <p className='herring-subtitle'>{name} · {product.weight}</p>
          </div>

          <div className='herring-card herring-wholesale'>
            <p className='herring-wholesale-caption'>Для вашего магазина, кафе или сети</p>
            <button ref={openerRef} className='herring-primary-button' type='button' onClick={() => dialogRef.current?.showModal()}>
              <span>Узнать оптовую цену</span><ArrowUpRight size={21} strokeWidth={1.5} aria-hidden='true' />
            </button>
            <a className='herring-inline-phone' href='tel:+79389042323'>+7 (938) 904-23-23</a>
          </div>

          <dl className='herring-facts'>
            {facts.map(([label, value]) => <div className='herring-card herring-fact' key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>

          <div className='herring-accordions'>
            <details className='herring-card herring-accordion' open>
              <summary>О продукте<ChevronDown size={20} strokeWidth={1.6} aria-hidden='true' /></summary>
              <div><p>{product.description}<br />Состав и условия хранения — на упаковке.</p></div>
            </details>
            <details className='herring-card herring-accordion'>
              <summary>Заказ и поставка<ChevronDown size={20} strokeWidth={1.6} aria-hidden='true' /></summary>
              <div><p>Оптовую цену и условия поставки можно уточнить по телефону <a href='tel:+79389042323'>+7 (938) 904-23-23</a>.</p></div>
            </details>
          </div>

          <Link href='/#directions' className='herring-back-link'><ArrowLeft size={20} strokeWidth={1.6} aria-hidden='true' /><span>Рыба и морепродукты</span></Link>
        </section>
      </div>
    </div>

    <dialog ref={dialogRef} className='herring-dialog' aria-labelledby='herring-dialog-title' onClose={() => openerRef.current?.focus()} onClick={event => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
      <button className='herring-dialog-close' type='button' onClick={() => dialogRef.current?.close()} aria-label='Закрыть окно'><X size={20} strokeWidth={1.8} /></button>
      <p className='herring-eyebrow'>{product.brand.toUpperCase()} · {product.weight.toUpperCase()}</p>
      <h2 id='herring-dialog-title'>Узнать оптовую цену</h2>
      <p>{name}.</p>
      <p>Свяжитесь с нами по телефону, чтобы уточнить цену и условия поставки.</p>
      <a className='herring-primary-button' href='tel:+79389042323'><span>Позвонить</span><span>+7 (938) 904-23-23</span></a>
    </dialog>
  </article>;
}

