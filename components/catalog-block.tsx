import { AnimatedMarqueeHero } from '@/components/ui/hero-3';
import { CATALOG } from '@/lib/catalog';

export function CatalogBlock() {
  return (
    <AnimatedMarqueeHero
      tagline='Каталог мороженого'
      title={
        <>
          Вкусы, которые
          <br />
          объединяют людей
        </>
      }
      description='Эскимо, вафельные стаканчики, рожки, пломбир и фруктовый лёд на натуральном сырье и по традиционным рецептам. Цены и условия поставки для оптовых покупателей — по запросу.'
      ctaText='Узнать оптовую цену'
      ctaHref='/contacts'
      items={CATALOG}
    />
  );
}
