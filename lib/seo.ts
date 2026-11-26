import type { Metadata } from 'next';
import { OG_IMAGE, SITE_NAME } from './site';

type ImageMeta = { url: string; width?: number; height?: number; alt: string };

type PageSeo = {
  title: string;
  description: string;
  /** Absolute site path with a trailing slash, for example `/catalog/`. */
  path: string;
  image?: ImageMeta;
  type?: 'website' | 'article';
};

/** Shared title, description, canonical link and social preview for a page. */
export function pageMetadata({ title, description, path, image = OG_IMAGE, type = 'website' }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'ru_RU',
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}
