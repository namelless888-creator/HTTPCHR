import type { MetadataRoute } from 'next';
import { HERRING_PRODUCTS } from '@/lib/herring';
import { PRODUCTS } from '@/lib/products';
import { absoluteUrl } from '@/lib/site';

// Build-time timestamp keeps the sitemap identical between repeated exports
// until the catalog itself changes.
const lastModified = new Date('2026-11-24');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/catalog/'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/about/'), lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: absoluteUrl('/contacts/'), lastModified, changeFrequency: 'yearly', priority: 0.8 },
  ];

  return [
    ...pages,
    ...PRODUCTS.map(product => ({
      url: absoluteUrl(`/product/${product.id}/`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...HERRING_PRODUCTS.map(product => ({
      url: absoluteUrl(`/herring/${product.id}/`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}

export const dynamic = 'force-static';
