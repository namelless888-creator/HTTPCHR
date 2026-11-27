import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata = pageMetadata({
  title: 'Контакты — RAMKAD',
  description: 'Адрес хладокомбината RAMKAD в Гудермесе, телефон, электронная почта, часы работы и анимированный маршрут.',
  path: '/contacts/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Контакты', path: '/contacts/' },
      ])} />
      <Landing page='contacts' />
    </>
  );
}
