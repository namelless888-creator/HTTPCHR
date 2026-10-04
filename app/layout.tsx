import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});
const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RAMCAD — хладокомбинат: мороженое, рыба, полуфабрикаты',
  description:
    'Ваш надёжный партнёр в холодном производстве. Авторская продукция с историей, натуральные ингредиенты в традиционных рецептах с 2003 года.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru' className={`${display.variable} ${sans.variable}`}>
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
