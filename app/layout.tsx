import type { Metadata, Viewport } from 'next';
import type { CSSProperties } from 'react';
import localFont from 'next/font/local';
import { JsonLd } from '@/components/json-ld';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, asset } from '@/lib/site';
import { organizationSchema, websiteSchema } from '@/lib/structured-data';
import './globals.css';
import './brand-scenes.css';
import './typography.css';

const display = localFont({
  src: [
    { path: '../public/fonts/playfair-display-cyrillic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/playfair-display-cyrillic-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: false,
});
const displayLatin = localFont({
  src: [
    { path: '../public/fonts/playfair-display-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/playfair-display-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  adjustFontFallback: false,
});
const sans = localFont({
  src: [
    { path: '../public/fonts/manrope-cyrillic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/manrope-cyrillic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/manrope-cyrillic-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/manrope-cyrillic-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-manrope',
  display: 'swap',
  adjustFontFallback: false,
});
const sansLatin = localFont({
  src: [
    { path: '../public/fonts/manrope-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/manrope-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/manrope-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/manrope-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — хладокомбинат: мороженое, рыба, полуфабрикаты`,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
    url: '/',
    title: `${SITE_NAME} — хладокомбинат: мороженое, рыба, полуфабрикаты`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — хладокомбинат: мороженое, рыба, полуфабрикаты`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: '#f4f9fb',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Fontsource provides separate alphabet subsets; keep both families in the stack.
  const fontVariables = {
    '--font-playfair': `${display.style.fontFamily}, ${displayLatin.style.fontFamily}, Georgia, serif`,
    '--font-manrope': `${sans.style.fontFamily}, ${sansLatin.style.fontFamily}, Arial, sans-serif`,
    // CSS url() cannot read the build-time base path, so pass them as variables.
    '--img-snow-logo': `url("${asset('/images/ramkad-snow-logo.png')}")`,
    '--img-studio-background': `url("${asset('/images/studio-background.webp')}")`,
    '--img-herring-studio': `url("${asset('/images/herring/studio-ice.png')}")`,
    '--img-herring-waves': `url("${asset('/images/herring/waves.svg')}")`,
  } as CSSProperties;

  return (
    <html lang='ru' data-scroll-behavior='smooth' className={`${display.variable} ${sans.variable}`} style={fontVariables}>
      <body className='bg-background font-sans text-foreground antialiased'>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground'
        >
          К содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
