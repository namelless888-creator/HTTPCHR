import type { Metadata } from 'next';
import { CatalogBlock } from '@/components/catalog-block';

export const metadata: Metadata = {
  title: 'Каталог мороженого — RAMCAD',
  description: 'Эскимо, вафельные стаканчики, рожки, пломбир и фруктовый лёд на натуральном сырье. 56 позиций каталога RAMCAD.',
};

export default function CatalogPage() {
  return (
    <main id='main'>
      <CatalogBlock />
    </main>
  );
}
