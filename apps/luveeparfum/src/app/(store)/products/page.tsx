import { ProductListMounter } from '@/mounters/product/product-list.mounter';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produtos — Compre online',
  description: 'Explore nossa seleção completa de produtos com os melhores preços.',
};

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-md bg-surface h-72 animate-pulse" />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-zinc-400 mb-6">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-medium">Produtos</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[40px] text-ink">PRODUTOS</h1>
        <select className="text-sm border border-zinc-200 rounded-sm px-3 py-2 bg-white text-ink">
          <option value="">Ordenar por</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="created_at">Mais recentes</option>
        </select>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListMounter />
      </Suspense>
    </div>
  );
}
