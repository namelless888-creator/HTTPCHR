import type { Metadata } from 'next';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { absoluteUrl, asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Каталог — RAMKAD',
  alternates: { canonical: absoluteUrl('/catalog/') },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to={asset('/catalog/')} label='Открыть каталог' />;
}
