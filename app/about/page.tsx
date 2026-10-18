import type { Metadata } from 'next';
import { Landing } from '@/components/landing';

export const metadata: Metadata = {
  title: 'О компании — RAMCAD',
  description: 'Хладокомбинат RAMCAD в Гудермесе: история с 2003 года, производство и стандарты качества.',
};

export default function Page() {
  return <Landing page='about' />;
}
