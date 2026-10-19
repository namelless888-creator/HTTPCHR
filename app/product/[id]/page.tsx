import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing';
import { getProduct, PRODUCTS } from '@/lib/products';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map(product => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return {
    title: `${product.name} — RAMCAD`,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return <Landing page='product' productId={product.id} />;
}
