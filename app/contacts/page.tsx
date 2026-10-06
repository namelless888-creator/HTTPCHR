import type { Metadata } from 'next';
import { ContactsBlock } from '@/components/ui/smooth-scroll';

export const metadata: Metadata = {
  title: 'Контакты — RAMCAD',
  description: 'Адрес, телефон и форма заявки хладокомбината RAMCAD в Гудермесе, Чеченская Республика.',
};

export default function ContactsPage() {
  return (
    <main id='main'>
      <ContactsBlock />
    </main>
  );
}
