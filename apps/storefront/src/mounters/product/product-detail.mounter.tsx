import { adaptProductDetail } from '@/adapters/product.adapter';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductInfo } from '@/components/product/product-info';
import { getMockProduct } from '@/lib/mock/products';

interface ProductDetailMounterProps {
  handle: string;
}

interface ProductsResponse {
  products: Record<string, unknown>[];
}

async function fetchProductByHandle(handle: string): Promise<Record<string, unknown> | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'}/store/products?handle=${handle}`;
    const res = await fetch(url, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ProductsResponse;
    return data.products?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function ProductDetailMounter({ handle }: ProductDetailMounterProps) {
  const raw = await fetchProductByHandle(handle);
  const product = raw ? adaptProductDetail(raw) : getMockProduct(handle);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-zinc-400">Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
      <ProductGallery images={product.images} title={product.title} />
      <ProductInfo {...product} />
    </div>
  );
}
