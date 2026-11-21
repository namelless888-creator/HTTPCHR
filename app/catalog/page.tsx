import type { Metadata } from 'next';
import { Landing } from '@/components/landing';

export const metadata: Metadata = {
  title: 'Каталог мороженого MARZO и рыбы Айсберг — RAMCAD',
  description: 'Мороженое MARZO и рыбные пресервы Айсберг в каталоге RAMCAD.',
};

export default function Page() {
  return <Landing page='catalog' />;
}
