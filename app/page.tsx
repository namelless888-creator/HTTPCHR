import type { Metadata } from 'next';
import { Landing } from '@/components/landing';

export const metadata: Metadata = {
  title: 'RAMCAD — создаём вкус, сохраняем свежесть',
};

export default function Page() {
  return <Landing page='home' />;
}
