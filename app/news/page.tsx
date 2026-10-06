import type { Metadata } from 'next';
import { NewsBlock } from '@/components/ui/news-block';

export const metadata: Metadata = {
  title: 'Новости — RAMCAD',
  description: 'Новости хладокомбината RAMCAD: новые вкусы, партнёрства и мероприятия.',
};

export default function NewsPage() {
  return (
    <main id='main'>
      <NewsBlock />
    </main>
  );
}
