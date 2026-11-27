import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata = pageMetadata({
  title: 'Каталог мороженого MARZO и рыбы Айсберг — RAMKAD',
  description: 'Мороженое MARZO и рыбные пресервы Айсберг в каталоге RAMKAD: рожки, эскимо, стаканчики, фруктовый лёд и семейные форматы.',
  path: '/catalog/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog/' },
      ])} />
      <Landing page='catalog' />
    </>
  );
}
