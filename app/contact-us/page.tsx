import type { Metadata } from 'next';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { absoluteUrl, asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Контакты — RAMCAD',
  alternates: { canonical: absoluteUrl('/contacts/') },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to={asset('/contacts/')} label='Контакты' />;
}
