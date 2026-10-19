'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, RotateCcw } from 'lucide-react';
import { SceneBackdrop } from '@/components/scene-backdrop';
import { mountCatalogIntro } from '@/lib/catalog-intro.mjs';

export function CatalogIntro() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => mountCatalogIntro(video.current), []);

  return <section className='catalog-intro scene-section' aria-labelledby='catalog-intro-heading'>
    <SceneBackdrop priority />
    <div className='catalog-intro-media'>
      <video ref={video} src='/videos/catalog-intro.mp4' poster='/images/catalog-intro-poster.webp' width={1280} height={736} muted playsInline preload='auto' aria-label='Рожок MARZO с солёной карамелью' />
    </div>
    <div className='catalog-intro-copy'>
      <p className='catalog-intro-eyebrow'>Коллекция MARZO <span /> 36 вкусов</p>
      <h1 id='catalog-intro-heading'>Выберите своё<br /><em>маленькое счастье.</em></h1>
      <a className='pill pill-dark catalog-intro-link' href='#catalog-products'>Выбрать вкус <ArrowDown size={20} strokeWidth={1.5} aria-hidden='true' /></a>
    </div>
    <div className='catalog-intro-controls'><button className='catalog-intro-replay' type='button' data-catalog-replay hidden><RotateCcw size={14} strokeWidth={1.5} aria-hidden='true' />Повторить анимацию</button></div>
  </section>;
}
