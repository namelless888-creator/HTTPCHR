import { CONTACTS, LEGAL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { PRODUCT_LEGAL } from './product-legal';
import type { Product } from './products';
import type { HerringProduct } from './herring';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: LEGAL.legalName,
  taxID: LEGAL.inn,
  identifier: [
    { '@type': 'PropertyValue', name: 'ИНН', value: LEGAL.inn },
    { '@type': 'PropertyValue', name: 'ОГРН', value: LEGAL.ogrn },
  ],
  url: `${SITE_URL}/`,
  logo: absoluteUrl('/favicon.ico'),
  image: absoluteUrl('/og-ramcad.png'),
  description: SITE_DESCRIPTION,
  email: CONTACTS.email,
  telephone: CONTACTS.phoneSchema,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressRegion: 'Чеченская Республика',
    addressLocality: 'Гудермес',
    streetAddress: '5-й км трассы Ростов–Баку',
    postalCode: CONTACTS.postalCode,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'ru-RU',
  publisher: { '@id': ORGANIZATION_ID },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  const mass = PRODUCT_LEGAL[product.id]?.mass ?? product.weight;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    image: absoluteUrl(product.src),
    category: product.category,
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: { '@id': ORGANIZATION_ID },
    ...(mass
      ? { additionalProperty: [{ '@type': 'PropertyValue', name: 'Масса нетто', value: mass }] }
      : {}),
  };
}

export function herringSchema(product: HerringProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.title} ${product.subtitle}`,
    description: `${product.description} Масса нетто — ${product.weight}.`,
    sku: product.id,
    gtin13: product.barcode,
    image: absoluteUrl(product.labelImage),
    category: product.category,
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: { '@id': ORGANIZATION_ID },
    additionalProperty: [{ '@type': 'PropertyValue', name: 'Масса нетто', value: product.weight }],
  };
}
