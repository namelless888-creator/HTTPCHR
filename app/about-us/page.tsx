import type { Metadata } from 'next';
import { LegacyRedirect } from '@/components/legacy-redirect';
import { absoluteUrl, asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'О компании — RAMKAD',
  alternates: { canonical: absoluteUrl('/about/') },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to={asset('/about/')} label='О компании' />;
}
