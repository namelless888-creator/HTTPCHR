import { HeroBrand } from '@/components/ui/hero-brand';
import { AboutBlock } from '@/components/ui/about-block';
import { ExtrasBlock } from '@/components/ui/extras-block';

export default function Page() {
  return (
    <main id='main'>
      <HeroBrand
        name='RAMCAD'
        eyebrow='Хладокомбинат · с 2003 года'
        headline='Ваш надёжный партнёр в холодном производстве'
        points={[
          'Авторская продукция с историей',
          'Надёжный поставщик для вашей сети',
          'Натуральные ингредиенты в традиционных рецептах с 2003',
        ]}
        primary={{ label: 'В каталог', href: '/catalog' }}
        secondary={{ label: 'О компании', href: '/#about' }}
        bgSrc='/images/hero-bg.jpg'
      />
      <AboutBlock />
      <ExtrasBlock />
    </main>
  );
}
