import { Landing } from '@/components/landing';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Новости — RAMCAD',
  description: 'Новости производства, партнёрства и истории MARZO. Архив хладокомбината RAMCAD.',
  path: '/news/',
});

export default function Page() {
  return <Landing page='news' />;
}
