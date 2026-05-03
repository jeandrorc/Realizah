import Link from 'next/link';
import Image from 'next/image';
import { HttpTypes } from '@medusajs/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: HttpTypes.StoreProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.calculated_price;

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.handle}`}>
        <div className="aspect-square bg-muted overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title ?? product.id}
              width={400}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              🛍️
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        {price?.calculated_amount != null && (
          <p className="text-lg font-bold mt-1">
            {formatCurrency(price.calculated_amount, price.currency_code ?? 'BRL')}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/products/${product.handle}`}
          className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Ver Produto
        </Link>
      </CardFooter>
    </Card>
  );
}
