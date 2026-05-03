'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

interface UseProductsOptions {
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
  q?: string;
  sort?: string;
  limit?: number;
}

interface ProductsPage {
  products: unknown[];
  count: number;
}

async function fetchProducts(
  options: UseProductsOptions & { offset?: number },
): Promise<ProductsPage> {
  const params = new URLSearchParams();
  if (options.q) params.set('q', options.q);
  if (options.sort) params.set('order', options.sort);
  params.set('limit', String(options.limit ?? 20));
  params.set('offset', String(options.offset ?? 0));
  if (options.categoryId) params.set('category_id[]', options.categoryId);
  if (options.collectionId) params.set('collection_id[]', options.collectionId);

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<ProductsPage>;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['products', options],
    queryFn: ({ pageParam }) => fetchProducts({ ...options, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (acc: number, p: ProductsPage) => acc + (p.products?.length ?? 0),
        0,
      );
      return loaded < lastPage.count ? loaded : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}
