import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata = pageMetadata({
  title: 'Политика обработки персональных данных — RAMCAD',
  description: 'Как RAMCAD обрабатывает данные из формы заявки: состав данных, цели, срок хранения, права посетителя и контакты оператора.',
  path: '/privacy/',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Политика конфиденциальности', path: '/privacy/' },
      ])} />
      <Landing page='privacy' />
    </>
  );
}
