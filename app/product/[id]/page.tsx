import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Landing } from '@/components/landing';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbSchema, productSchema } from '@/lib/structured-data';
import { getProduct, PRODUCTS } from '@/lib/products';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map(product => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return pageMetadata({
    title: `${product.name} — RAMCAD`,
    description: product.description,
    path: `/product/${product.id}/`,
    image: { url: product.src, width: 420, height: 560, alt: product.name },
  });
}

export default async function Page({ params }: Props) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog/' },
        { name: product.name, path: `/product/${product.id}/` },
      ])} />
      <Landing page='product' productId={product.id} />
    </>
  );
}
