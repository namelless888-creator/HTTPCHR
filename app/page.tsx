import { SiteHeader } from '@/components/ui/site-header';
import { HeroBrand } from '@/components/ui/hero-brand';
import { CatalogBlock } from '@/components/catalog-block';
import { AboutBlock } from '@/components/ui/about-block';
import { ExtrasBlock } from '@/components/ui/extras-block';
import { NewsBlock } from '@/components/ui/news-block';
import { ContactsBlock } from '@/components/ui/smooth-scroll';

export default function Page() {
  return (
    <>
      <SiteHeader />
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
          primary={{ label: 'В каталог', href: '#catalog' }}
          secondary={{ label: 'О компании', href: '#about' }}
          bgSrc='/images/hero-bg.jpg'
        />
        <CatalogBlock />
        <AboutBlock />
        <ExtrasBlock />
        <NewsBlock />
        <ContactsBlock />
      </main>
    </>
  );
}
