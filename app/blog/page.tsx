import type { Metadata } from 'next';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { absoluteUrl, asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Новости — RAMCAD',
  alternates: { canonical: absoluteUrl('/news/') },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to={asset('/news/')} label='Новости RAMCAD' />;
}
