import { ProductGrid } from '@/components/product/product-grid';
import { adaptProduct } from '@/adapters/product.adapter';
import { getMockProducts } from '@/lib/mock/products';
import { getCategoryByHandle } from '@/lib/api/categories';

interface ProductListMounterProps {
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  brandName?: string;
  limit?: number;
  columns?: 2 | 3 | 4;
  featured?: boolean;
}

interface ProductsResponse {
  products: Record<string, unknown>[];
  count: number;
}

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_API_URL ??
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
  'http://localhost:9000';

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? '';

async function fetchProductsServer(params: ProductListMounterProps): Promise<ProductsResponse> {
  try {
    const url = new URL(`${MEDUSA_URL}/store/products`);
    url.searchParams.set('limit', String(params.limit ?? 20));
    if (REGION_ID) url.searchParams.set('region_id', REGION_ID);
    if (params.categoryId) url.searchParams.append('category_id[]', params.categoryId);
    if (params.collectionId) url.searchParams.append('collection_id[]', params.collectionId);

    const res = await fetch(url.toString(), {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], count: 0 };
    return res.json() as Promise<ProductsResponse>;
  } catch {
    return { products: [], count: 0 };
  }
}

export async function ProductListMounter(props: ProductListMounterProps) {
  // Resolve categorySlug → categoryId from Medusa if needed
  let resolvedCategoryId = props.categoryId;
  if (!resolvedCategoryId && props.categorySlug) {
    const cat = await getCategoryByHandle(props.categorySlug);
    if (cat) resolvedCategoryId = cat.id;
  }

  const { products } = await fetchProductsServer({ ...props, categoryId: resolvedCategoryId });

  const adapted =
    products.length > 0
      ? products.map(adaptProduct)
      : getMockProducts({
          limit: props.limit,
          categorySlug: props.categorySlug,
          brandName: props.brandName,
          featured: props.featured,
        });

  return <ProductGrid products={adapted} columns={props.columns} />;
}
