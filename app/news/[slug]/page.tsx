import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { NEWS, getNewsBySlug } from '@/lib/news';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, SITE_NAME } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => NEWS.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const item = getNewsBySlug((await params).slug);
  if (!item) notFound();
  return pageMetadata({ title: `${item.title} — RAMCAD`, description: item.excerpt, path: `/news/${item.slug}/`, type: 'article', image: { url: absoluteUrl(item.image), alt: item.imageAlt } });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const item = getNewsBySlug((await params).slug);
  if (!item) notFound();
  return <>
    <JsonLd data={{
      '@context': 'https://schema.org', '@type': 'NewsArticle',
      headline: item.title, description: item.excerpt, datePublished: item.iso,
      image: absoluteUrl(item.image), mainEntityOfPage: absoluteUrl(`/news/${item.slug}/`),
      author: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
      publisher: { '@id': absoluteUrl('/#organization') },
      isBasedOn: item.sourceUrl, inLanguage: 'ru-RU',
    }} />
    <Landing page='news' newsSlug={item.slug} />
  </>;
}
