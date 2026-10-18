'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  eyebrow: string;
  headline: string[];
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  images: { src: string; alt: string }[];
  className?: string;
};

export function HeroSplit({ eyebrow, headline, cta, secondaryCta, images, className = '' }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <section id="hero" className={`relative isolate min-h-[100svh] overflow-hidden bg-[#10343b] pt-16 text-white ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,#33727a_0%,#174650_42%,#10343b_80%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1500px] items-center gap-8 px-6 py-16 md:px-12 lg:grid-cols-2 lg:px-20">
        <div className="relative z-20">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[.3em] text-[#c5e0e1]">{eyebrow}</p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="font-display text-[clamp(3.4rem,6vw,6.7rem)] font-semibold leading-[1.01] tracking-tight">
            {headline.map(line => <span key={line} className="block">{line}</span>)}
          </motion.h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[#d4e4e4]">Мороженое, рыба и морепродукты. Качество, которое объединяет наши направления.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={cta.href} className="inline-flex items-center gap-5 rounded-full bg-white px-7 py-4 font-semibold text-[#10343b] transition hover:bg-[#dce9e7]">{cta.label}<ArrowUpRight size={18}/></Link>
            <Link href={secondaryCta.href} className="inline-flex items-center gap-4 rounded-full border border-white/40 px-7 py-4 font-semibold transition hover:bg-white/10">{secondaryCta.label}<ArrowUpRight size={18}/></Link>
          </div>
        </div>
        <div className="relative flex min-h-[440px] items-center justify-center lg:min-h-[690px]">
          <div className="absolute inset-[10%] rounded-full border border-white/10" />
          <div className="absolute inset-[20%] rounded-full border border-white/10" />
          {images.map((image, index) => (
            <motion.div key={image.src} initial={reduceMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + index * .15, duration: .8 }} className={`absolute overflow-hidden rounded-3xl border border-white/20 bg-[#ecf0ed] p-2 shadow-2xl ${index === 0 ? 'left-[3%] top-[25%] w-[38%] -rotate-12' : index === 1 ? 'left-[30%] top-[10%] z-10 w-[45%]' : 'bottom-[9%] right-[1%] w-[38%] rotate-12'}`}>
              <img src={image.src} alt={image.alt} className="aspect-[3/4] w-full rounded-2xl object-cover"/>
            </motion.div>
          ))}
        </div>
      </div>
      <a href="#directions" className="absolute bottom-5 left-6 text-xs uppercase tracking-[.2em] text-white/70 md:left-12">Листайте вниз ↓</a>
    </section>
  );
}
