import type { Metadata } from 'next';
import { Landing } from '@/components/landing';

export const metadata: Metadata = {
  title: 'Каталог мороженого MARZO — RAMCAD',
  description: '36 вкусов мороженого MARZO: рожки, эскимо, стаканчики, фруктовый лёд и семейная коллекция.',
};

export default function Page() {
  return <Landing page='catalog' />;
}
