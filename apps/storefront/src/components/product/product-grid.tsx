import { ProductCard } from './product-card';
import type { ProductCardProps } from '@/adapters/product.adapter';

interface ProductGridProps {
  products: ProductCardProps[];
  columns?: 2 | 3 | 4;
}

const colsMap: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-zinc-400">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colsMap[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
