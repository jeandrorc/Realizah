import { listProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/store/product-card';

export const metadata = { title: 'Produtos' };

export default async function ProductsPage() {
  const { products, count } = await listProducts({ limit: 20 });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <p className="text-muted-foreground mt-2">
          {count} produto{count !== 1 ? 's' : ''} disponível{count !== 1 ? 'is' : ''}
        </p>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Nenhum produto disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
