import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata = pageMetadata({
  title: 'О компании — RAMKAD',
  description: 'Хладокомбинат RAMKAD в Гудермесе: история с 2003 года, производство и стандарты качества.',
  path: '/about/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'О компании', path: '/about/' },
      ])} />
      <Landing page='about' />
    </>
  );
}
