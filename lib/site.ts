// Build-time base path. Preview builds live under this sub-path, so every
// generated asset and route is prefixed with it. On a dedicated domain build
// with an empty value: NEXT_PUBLIC_BASE_PATH= npm run build
const previewBasePath = '/namelless888-creator/HTTPCHR/component-swap-preview';
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? previewBasePath;

// Canonical, Open Graph and sitemap URLs need an absolute public address.
// Override it for the production domain, for example:
//   NEXT_PUBLIC_SITE_URL=https://ramcad.example npm run build
const publicUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://namelless888-creator.github.io/HTTPCHR/component-swap-preview';

export const SITE_URL = publicUrl.replace(/\/+$/, '');
export const SITE_NAME = 'RAMCAD';
export const SITE_DESCRIPTION =
  'RAMCAD — хладокомбинат в Гудермесе: мороженое MARZO, рыбные пресервы «Айсберг» и полуфабрикаты. Собственное производство с 2003 года.';

export const OG_IMAGE = {
  url: '/og-ramcad.png',
  width: 1200,
  height: 630,
  alt: 'RAMCAD — мороженое и рыба, хладокомбинат в Гудермесе',
};

export const CONTACTS = {
  phone: '+7 (938) 904-23-23',
  phoneHref: 'tel:+79389042323',
  phoneSchema: '+7-938-904-23-23',
  email: 'oooiceberg95@mail.ru',
  address: 'Чеченская Республика, г. Гудермес, 5-й км трассы Ростов–Баку',
  postalCode: '366208',
  hours: 'Пн–Сб, 08:00–18:00',
};

// Verified against the ЕГРЮЛ record for the GUDERMES ice-cream plant.
export const LEGAL = {
  legalName: 'ООО «Айсберг»',
  inn: '2005004860',
  ogrn: '1072032001623',
  kpp: '200501001',
};

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Prefixes a public-folder path with the deployment base path (videos, CSS). */
export const asset = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.startsWith(BASE_PATH) ? normalized : `${BASE_PATH}${normalized}`;
};
