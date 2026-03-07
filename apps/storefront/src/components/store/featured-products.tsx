import Link from 'next/link';
import { listProducts } from '@/lib/api/products';
import { ProductCard } from './product-card';

export async function FeaturedProducts() {
  const { products } = await listProducts({ limit: 4 });

  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
