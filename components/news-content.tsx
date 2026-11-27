'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { NEWS_SORTED, NEWS_TYPES, type NewsItem } from '@/lib/news';

export function NewsCards({ items }: { items: NewsItem[] }) {
  return <div className='journal-grid'>{items.map(item => <Link className='journal-card' data-news-type={item.type} href={`/news/${item.slug}/`} key={item.slug}>
    <div className='journal-card-image'><Image src={item.image} alt={item.imageAlt} width={1038} height={678} sizes='(max-width: 700px) 100vw, 50vw' /></div>
    <div className='journal-card-copy'>
      <div className='journal-meta'><time dateTime={item.iso}>{item.date}</time><span>{item.type}</span></div>
      <h2>{item.title}</h2><p>{item.excerpt}</p>
      <span className='journal-read'>Читать историю <ArrowUpRight size={18} aria-hidden /></span>
    </div>
  </Link>)}</div>;
}

export function NewsIndex() {
  const [type, setType] = useState('Все');
  const items = type === 'Все' ? NEWS_SORTED : NEWS_SORTED.filter(item => item.type === type);
  return <section className='journal section-pad'>
    <div className='journal-intro'><h1>Жизнь<br />за пределами цеха.</h1><p>Новости RAMCAD: производство, встречи и истории MARZO.</p></div>
    <div className='journal-filters' role='group' aria-label='Темы новостей'>{['Все', ...NEWS_TYPES].map(label => <button type='button' key={label} aria-pressed={label === type} onClick={() => setType(label)}>{label}</button>)}</div>
    <p className='sr-only' aria-live='polite'>Материалов: {items.length}</p>
    <NewsCards items={items} />
  </section>;
}

export function NewsArticle({ item }: { item: NewsItem }) {
  return <>
    <article className='journal-article'>
      <header className='journal-article-heading section-pad'>
        <Link href='/news/' className='text-link'>Все новости</Link>
        <div className='journal-meta'><time dateTime={item.iso}>{item.date}</time><span>{item.type}</span></div>
        <h1>{item.title}</h1>
        <p>{item.excerpt}</p>
      </header>
      <figure className='journal-cover'><Image src={item.image} alt={item.imageAlt} width={1038} height={678} sizes='100vw' priority /></figure>
      <div className='journal-body'>
        <p className='journal-archive-note'>Из архива · {item.date}. Сведения об ассортименте и производстве относятся к дате публикации.</p>
        {item.body.map((block, index) => block.type === 'h3' ? <h2 key={index}>{block.text}</h2> : <p key={index}>{block.text}</p>)}
        <p className='journal-source'>Сокращённая версия материала. <a href={item.sourceUrl} target='_blank' rel='noopener noreferrer'>Оригинал на icechr.ru</a></p>
        <Link href='/catalog/' className='text-link'>Актуальный каталог</Link>
      </div>
    </article>
    <section className='journal-related section-pad'><h2>Ещё истории</h2><NewsCards items={NEWS_SORTED.filter(other => other.slug !== item.slug).slice(0, 2)} /></section>
  </>;
}
