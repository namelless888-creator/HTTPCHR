'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { mountCatalogIntro } from '@/lib/catalog-intro.mjs';
import { asset } from '@/lib/site';

const PARTS = [
  { id: 'cream', title: 'Классический пломбир', text: 'Нежная сливочная текстура', x: .476, y: .405, start: .58, end: .68 },
  { id: 'caramel', title: 'Белая глазурь', text: 'Тонкое хрустящее покрытие', x: .488, y: .49, start: .70, end: .80 },
  { id: 'waffle', title: 'Эскимо MARZO', text: 'Знакомый вкус в зимней коллекции', x: .475, y: .72, start: .82, end: .92 },
];

export function CatalogIntro() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => mountCatalogIntro(video.current), []);

  return <section className='catalog-intro' aria-labelledby='catalog-intro-heading'>
    <h1 id='catalog-intro-heading' className='sr-only'>Зимняя коллекция мороженого MARZO</h1>
    <div className='catalog-intro-stage'>
      <video className='catalog-intro-video' ref={video} src={asset('/videos/home-hero.mp4')} poster={asset('/images/home-hero-poster.webp')} width={1672} height={940} muted playsInline preload='auto' aria-label='Классическое эскимо MARZO в зимнем горном пейзаже' />
      <Image className='catalog-intro-still' src='/images/home-hero-poster.webp' alt='' width={1672} height={940} loading='eager' />
      {PARTS.map((part, index) => <div key={part.id} className={`catalog-callout catalog-callout-${part.id}`} data-target-x={part.x} data-target-y={part.y} data-reveal-start={part.start} data-reveal-end={part.end} aria-hidden='true'>
        <svg className='catalog-callout-arrow' aria-hidden='true'>
          <path className='catalog-callout-shadow' pathLength={1} />
          <path className='catalog-callout-line' pathLength={1} />
          <path className='catalog-callout-head' />
          <circle className='catalog-callout-target' r={3.5} />
        </svg>
        <div className='catalog-callout-label'><span>0{index + 1}</span><div><h3>{part.title}</h3><p>{part.text}</p></div></div>
      </div>)}
      <div className='catalog-intro-hint'><span>Листайте и раскрывайте вкус</span><ArrowDown size={17} strokeWidth={1.5} aria-hidden='true' /></div>
      <a className='catalog-intro-skip' href='#catalog-products'>К каталогу <ArrowDown size={16} strokeWidth={1.5} aria-hidden='true' /></a>
      <div className='catalog-intro-progress' aria-hidden='true'><span /></div>
    </div>
  </section>;
}
