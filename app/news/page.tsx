import { Landing } from '@/components/landing';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Новости — RAMKAD',
  description: 'Новости производства, партнёрства и истории MARZO. Архив хладокомбината RAMKAD.',
  path: '/news/',
});

export default function Page() {
  return <Landing page='news' />;
}
