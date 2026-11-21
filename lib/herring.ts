// Catalog of the «Айсберг» herring preserves, built from the
// ramcad-aisberg-collection kit (8 precise product layouts). Every SKU has
// its own label render from the kit and its own real
// fish cutout, positioned over a shared studio backdrop and packaging shell
// per the kit's `products.json` geometry. Two weight-sibling pairs reuse the
// same fish photo because the underlying product shot is identical: 180 г
// and 500 г "с пряностями", and 900 г and 2000 г "филе".

import type { CSSProperties } from 'react';

export interface HerringProduct {
  id: string;
  brand: string;
  category: string;
  title: string;
  subtitle: string;
  format: string;
  weight: string;
  barcode: string;
  description: string;
  accent: string;
  accentTint: string;
  fishImage: string;
  labelImage: string;
  /** [x, y, width, height] as % of the 1774×887 studio scene. */
  fishBox: [number, number, number, number];
  /** [x, y, width] as % of the 1774×887 studio scene (packaging is square). */
  packBox: [number, number, number];
}

const SCENE = { width: 1774, height: 887 };
const pct = (value: number, axis: 'x' | 'y') => `${(value / SCENE[axis === 'x' ? 'width' : 'height'] * 100).toFixed(4)}%`;

export const HERRING_PRODUCTS: HerringProduct[] = [
  {
    id: 'herring-oil-180',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'кусочками в масле',
    format: 'Филе кусочками',
    weight: '180 г',
    barcode: '4630002011191',
    description: 'Сельдь кусочками в масле.',
    accent: '#C99A3C',
    accentTint: '#E6CA91',
    fishImage: '/images/herring/fish-oil-180.png',
    labelImage: '/images/herring/label-oil-180.png',
    fishBox: [164.06, 230.59, 751.72, 751.72],
    packBox: [52, 132, 495],
  },
  {
    id: 'herring-oil-500',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'кусочками в масле',
    format: 'Филе кусочками',
    weight: '500 г',
    barcode: '4630002011252',
    description: 'Сельдь кусочками в масле.',
    accent: '#C99A3C',
    accentTint: '#E6CA91',
    fishImage: '/images/herring/fish-oil-500.png',
    labelImage: '/images/herring/label-oil-500.png',
    fishBox: [167.89, 231.45, 741.32, 741.32],
    packBox: [25, 106, 540],
  },
  {
    id: 'herring-steaks-725',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'кусковая в масле',
    format: 'Кусковая',
    weight: '725 г',
    barcode: '4630002011733',
    description: 'Сельдь кусковая в масле.',
    accent: '#3E638B',
    accentTint: '#BCD6E7',
    fishImage: '/images/herring/fish-steaks.png',
    labelImage: '/images/herring/label-steaks-725.png',
    fishBox: [327.88, 274.05, 596.75, 596.75],
    packBox: [20, 112, 530],
  },
  {
    id: 'herring-fillet-900',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'филе в масле',
    format: 'Филе',
    weight: '900 г',
    barcode: '4630002011313',
    description: 'Сельдь филе в масле.',
    accent: '#BA8835',
    accentTint: '#E6CA91',
    fishImage: '/images/herring/fish-fillets.png',
    labelImage: '/images/herring/label-fillet-900.png',
    fishBox: [298.88, 245.23, 653.3, 612.95],
    packBox: [25, 106, 540],
  },
  {
    id: 'herring-fillet-2000',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'филе в масле',
    format: 'Филе',
    weight: '2000 г',
    barcode: '4630002011740',
    description: 'Сельдь филе в масле.',
    accent: '#BA8835',
    accentTint: '#E6CA91',
    fishImage: '/images/herring/fish-fillets.png',
    labelImage: '/images/herring/label-fillet-2000.png',
    fishBox: [298.88, 245.23, 653.3, 612.95],
    packBox: [8, 90, 575],
  },
  {
    id: 'herring-spices-180',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'с пряностями',
    format: 'Филе кусочками',
    weight: '180 г',
    barcode: '4630002011283',
    description: 'Сельдь филе кусочками в масле с пряностями.',
    accent: '#1B8273',
    accentTint: '#BFE2D9',
    fishImage: '/images/herring/fish-spices.png',
    labelImage: '/images/herring/label-spices-180.png',
    fishBox: [164.49, 247.66, 750.53, 750.53],
    packBox: [52, 132, 495],
  },
  {
    id: 'herring-spices-500',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: 'с пряностями',
    format: 'Филе кусочками',
    weight: '500 г',
    barcode: '4630002011276',
    description: 'Сельдь филе кусочками в масле с пряностями.',
    accent: '#1B8273',
    accentTint: '#BFE2D9',
    fishImage: '/images/herring/fish-spices.png',
    labelImage: '/images/herring/label-spices-500.png',
    fishBox: [164.49, 247.66, 750.53, 750.53],
    packBox: [25, 106, 540],
  },
  {
    id: 'herring-ruby-500',
    brand: 'Айсберг',
    category: 'Рыбные пресервы',
    title: 'Сельдь',
    subtitle: '«Рубиновая»',
    format: 'Филе кусочками',
    weight: '500 г',
    barcode: '4630002011825',
    description: 'Сельдь филе кусочками в масле «Рубиновая».',
    accent: '#B92E37',
    accentTint: '#E8BEC2',
    fishImage: '/images/herring/fish-ruby.png',
    labelImage: '/images/herring/label-ruby-500.png',
    fishBox: [155.07, 247.85, 780.15, 780.15],
    packBox: [25, 106, 540],
  },
];

export const herringSceneStyle = (product: HerringProduct): CSSProperties => ({
  '--fish-x': pct(product.fishBox[0], 'x'),
  '--fish-y': pct(product.fishBox[1], 'y'),
  '--fish-width': pct(product.fishBox[2], 'x'),
  '--pack-x': pct(product.packBox[0], 'x'),
  '--pack-y': pct(product.packBox[1], 'y'),
  '--pack-width': pct(product.packBox[2], 'x'),
  '--variant-tint': product.accentTint,
  '--variant-accent': product.accent,
} as CSSProperties);

export const herringProductHref = (product: Pick<HerringProduct, 'id'>) => `/herring/${product.id}`;
export const getHerringProduct = (id: string) => HERRING_PRODUCTS.find(product => product.id === id);
