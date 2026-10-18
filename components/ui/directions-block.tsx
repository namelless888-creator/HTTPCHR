'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const directions = [
  { number:'01',title:'Мороженое',subtitle:'Любимые вкусы, созданные с заботой', description:'От классики до ярких сочетаний MARZO — коллекция мороженого для каждого момента.', image:'/images/catalog/11.jpg', href:'/catalog',cta:'Смотреть каталог',alt:'Мороженое MARZO' },
  { number:'02',title:'Рыба и морепродукты',subtitle:'Свежесть в каждой поставке', description:'Продукция для магазинов, ресторанов и партнёров. Качество и надёжная логистика.', image:'/images/extras/seld-file.jpg',href:'/contacts',cta:'Узнать о поставках',alt:'Рыбная продукция' },
];
export function DirectionsBlock({className}:{className?:string}) {
  return <section id="directions" className={cn('scroll-mt-16 bg-[#f1f4f1] py-20 text-[#102d34] md:py-32',className)}>
    <div className="mx-auto max-w-[1500px] px-6 md:px-12 lg:px-20">
      <Reveal><div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.3em] text-[#48747a]">То, что мы делаем</p><h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">Два направления.<br/>Один подход к качеству.</h2></div><span className="max-w-56 text-sm leading-relaxed text-[#557078]">От любимого мороженого до продукции для профессионалов.</span></div></Reveal>
      <div className="grid gap-5 lg:grid-cols-2">
        {directions.map((item,i)=><Reveal key={item.number} delay={i*.12}><article className="group relative min-h-[510px] overflow-hidden rounded-[2rem] bg-[#153d45] text-white md:min-h-[610px]">
          <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c252b] via-[#0c252b]/45 to-[#0c252b]/10"/>
          <div className="relative flex min-h-[510px] flex-col justify-between p-7 md:min-h-[610px] md:p-10">
            <div className="flex items-start justify-between"><span className="rounded-full border border-white/60 px-4 py-2 text-xs tracking-[.15em]">НАПРАВЛЕНИЕ {item.number}</span><ArrowUpRight size={28} className="opacity-80 transition group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
            <div><p className="mb-3 text-sm font-semibold text-white/80">{item.subtitle}</p><h3 className="max-w-lg font-display text-4xl font-semibold leading-tight md:text-5xl">{item.title}</h3><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80 md:text-base">{item.description}</p><Link href={item.href} className="mt-8 inline-flex min-h-12 items-center gap-4 rounded-full bg-white px-6 font-semibold text-[#102d34] transition hover:bg-[#dce9e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{item.cta}<ArrowUpRight size={18}/></Link></div>
          </div>
        </article></Reveal>)}
      </div>
    </div>
  </section>;
}
