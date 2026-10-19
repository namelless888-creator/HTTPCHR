'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { mountHomeHero } from '@/lib/home-hero.mjs';

export function HomeHeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => mountHomeHero(video.current), []);

  return <div className='reference-hero-photo hero-film'>
    <Image className='hero-film-poster' src='/images/home-hero-poster.webp' alt='' width={1280} height={736} unoptimized priority />
    <video ref={video} className='hero-film-video' src='/videos/home-hero.mp4' poster='/images/home-hero-poster.webp' width={1280} height={736} muted playsInline preload='auto' aria-label='Мороженое MARZO в движении: солёная карамель, эскимо и шоколадный пломбир' />
    <button className='hero-film-control' type='button' data-film-toggle data-state='paused' aria-label='Продолжить анимацию' hidden>
      <Pause className='film-icon-pause' size={15} aria-hidden='true' />
      <Play className='film-icon-play' size={15} aria-hidden='true' />
      <RotateCcw className='film-icon-repeat' size={15} aria-hidden='true' />
      <span data-film-label>Продолжить</span>
    </button>
  </div>;
}
