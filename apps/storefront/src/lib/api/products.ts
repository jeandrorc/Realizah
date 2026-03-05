import { HttpTypes } from '@medusajs/types';
import { medusa } from '../medusa';

export async function listProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
}): Promise<HttpTypes.StoreProductListResponse> {
  return medusa.store.product.list(params ?? {});
}

export async function getProduct(handle: string): Promise<HttpTypes.StoreProduct | null> {
  const { products } = await medusa.store.product.list({ handle });
  return products[0] ?? null;
}
