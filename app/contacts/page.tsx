import type { Metadata } from 'next';
import { Landing } from '@/components/landing';

export const metadata: Metadata = {
  title: 'Контакты — RAMCAD',
  description: 'Адрес хладокомбината RAMCAD в Гудермесе, телефон, электронная почта, часы работы и анимированный маршрут.',
};

export default function Page() {
  return <Landing page='contacts' />;
}
