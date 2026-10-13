import type { Metadata } from 'next';
import { CatalogBlock } from '@/components/catalog-block';
import { CatalogGrid } from '@/components/ui/catalog-grid';

export const metadata: Metadata = {
  title: 'Каталог мороженого — RAMCAD',
  description: 'Эскимо, вафельные стаканчики, рожки, пломбир и фруктовый лёд на натуральном сырье. Фирменная линейка MARZO от RAMCAD.',
};

export default function CatalogPage() {
  return (
    <main id='main'>
      <CatalogBlock />
      <CatalogGrid />
    </main>
  );
}
