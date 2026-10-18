import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import localFont from 'next/font/local';
import './globals.css';

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
  title: 'RAMCAD — хладокомбинат: мороженое, рыба, полуфабрикаты',
  description:
    'Ваш надёжный партнёр в холодном производстве. Авторская продукция с историей, натуральные ингредиенты в традиционных рецептах с 2003 года.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Fontsource provides separate alphabet subsets; keep both families in the stack.
  const fontVariables = {
    '--font-playfair': `${display.style.fontFamily}, ${displayLatin.style.fontFamily}, Georgia, serif`,
    '--font-manrope': `${sans.style.fontFamily}, ${sansLatin.style.fontFamily}, Arial, sans-serif`,
  } as CSSProperties;

  return (
    <html lang='ru' data-scroll-behavior='smooth' className={`${display.variable} ${sans.variable}`} style={fontVariables}>
      <body className='bg-background font-sans text-foreground antialiased'>
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
