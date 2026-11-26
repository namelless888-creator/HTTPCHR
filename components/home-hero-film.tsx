'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { mountHomeHero } from '@/lib/home-hero.mjs';
import { asset } from '@/lib/site';

export function HomeHeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => mountHomeHero(video.current), []);

  return <div className='reference-hero-photo hero-film'>
    <Image className='hero-film-poster' src='/images/home-hero-poster.webp' alt='' width={1672} height={940} priority />
    <video ref={video} className='hero-film-video' src={asset('/videos/home-hero.mp4')} poster={asset('/images/home-hero-poster.webp')} width={1672} height={940} muted playsInline preload='auto' aria-label='Классическое эскимо MARZO в зимнем горном пейзаже' />
    <button className='hero-film-control' type='button' data-film-toggle data-state='paused' aria-label='Продолжить анимацию' hidden>
      <Pause className='film-icon-pause' size={15} aria-hidden='true' />
      <Play className='film-icon-play' size={15} aria-hidden='true' />
      <RotateCcw className='film-icon-repeat' size={15} aria-hidden='true' />
      <span data-film-label>Продолжить</span>
    </button>
  </div>;
}
