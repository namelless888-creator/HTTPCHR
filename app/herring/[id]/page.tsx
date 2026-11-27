import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema, herringSchema } from '@/lib/structured-data';
import { getHerringProduct, HERRING_PRODUCTS } from '@/lib/herring';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return HERRING_PRODUCTS.map(product => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getHerringProduct((await params).id);
  if (!product) notFound();
  const name = `${product.title} ${product.subtitle}`;
  return pageMetadata({
    title: `${name}, ${product.weight} — RAMKAD`,
    description: `${product.description} Масса нетто — ${product.weight}.`,
    path: `/herring/${product.id}/`,
    image: { url: product.labelImage, alt: name },
  });
}

export default async function Page({ params }: Props) {
  const product = getHerringProduct((await params).id);
  if (!product) notFound();
  const name = `${product.title} ${product.subtitle}`;
  return (
    <>
      <JsonLd data={herringSchema(product)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog/' },
        { name: name, path: `/herring/${product.id}/` },
      ])} />
      <Landing page='herring' productId={product.id} />
    </>
  );
}
