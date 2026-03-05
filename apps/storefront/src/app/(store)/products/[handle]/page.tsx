import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getProduct } from '@/lib/api/products';
import { formatCurrency } from '@/lib/utils';
import { AddToCartButton } from '@/components/store/add-to-cart-button';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const firstVariant = product.variants?.[0];
  const price = firstVariant?.calculated_price;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title ?? product.id}
              width={600}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {price?.calculated_amount != null && (
              <p className="text-2xl font-bold text-primary mt-2">
                {formatCurrency(price.calculated_amount, price.currency_code ?? 'BRL')}
              </p>
            )}
          </div>
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          {firstVariant?.id && <AddToCartButton variantId={firstVariant.id} />}
        </div>
      </div>
    </div>
  );
}
