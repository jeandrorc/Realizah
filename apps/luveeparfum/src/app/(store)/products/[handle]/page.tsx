import { ProductDetailMounter } from '@/mounters/product/product-detail.mounter';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Compre ${handle} com os melhores preços e condições.`,
  };
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
      <div className="aspect-square rounded-lg bg-surface animate-pulse" />
      <div className="space-y-4">
        {[80, 60, 40, 40, 60].map((w, i) => (
          <div
            key={i}
            className="h-6 bg-surface rounded animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-zinc-400 mb-8">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">
          Produtos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-medium capitalize">{handle.replace(/-/g, ' ')}</span>
      </nav>

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailMounter handle={handle} />
      </Suspense>
    </div>
  );
}
