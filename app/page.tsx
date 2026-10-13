import { HeroSplit } from '@/components/ui/hero-split';
import { DirectionsBlock } from '@/components/ui/directions-block';
import { AboutBlock } from '@/components/ui/about-block';
import { ExtrasBlock } from '@/components/ui/extras-block';

export default function Page() {
  return (
    <main id='main'>
      <HeroSplit
        eyebrow='Хладокомбинат · с 2003 года'
        headline={['Создаём вкус.', 'Сохраняем свежесть.']}
        cta={{ label: 'Смотреть каталог', href: '/catalog' }}
        secondaryCta={{ label: 'О компании', href: '/#about' }}
        images={[
          { src: '/images/catalog/04.jpg', alt: 'MARZO «Солёная карамель» в вафельном рожке' },
          { src: '/images/catalog/11.jpg', alt: 'MARZO Шоколадное' },
          { src: '/images/catalog/19.jpg', alt: 'MARZO «Сыр-Абрикос-Грецкий орех»' },
        ]}
      />
      <DirectionsBlock />
      <AboutBlock />
      <ExtrasBlock />
    </main>
  );
}
