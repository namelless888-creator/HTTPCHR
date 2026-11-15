import type { CSSProperties } from 'react';

export type HerringProduct = {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  category: string;
  format: string;
  weight: string;
  description: string;
  labelImage: string;
  fishImage: string;
};

// The uploaded components reference a herring catalog, but its source data and
// photography were not included. Keep the collection empty until the original
// lib/herring.ts and images are supplied; this avoids inventing product data.
export const HERRING_PRODUCTS: HerringProduct[] = [];

export const getHerringProduct = (id: string) => HERRING_PRODUCTS.find(product => product.id === id);
export const herringProductHref = (product: HerringProduct) => `/herring/${product.id}`;
export const herringSceneStyle = (product: HerringProduct): CSSProperties => {
  void product;
  return {};
};
