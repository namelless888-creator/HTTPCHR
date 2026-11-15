import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing';
import { getHerringProduct, HERRING_PRODUCTS } from '@/lib/herring';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return HERRING_PRODUCTS.map(product => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getHerringProduct((await params).id);
  if (!product) notFound();
  return {
    title: `${product.title} ${product.subtitle}, ${product.weight} — RAMCAD`,
    description: `${product.description} Масса нетто — ${product.weight}.`,
  };
}

export default async function Page({ params }: Props) {
  const product = getHerringProduct((await params).id);
  if (!product) notFound();
  return <Landing page='herring' productId={product.id} />;
}
