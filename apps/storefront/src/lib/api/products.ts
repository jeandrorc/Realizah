import { HttpTypes } from '@medusajs/types';
import { medusa } from '../medusa';

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? '';

export async function listProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  collection_id?: string[];
}): Promise<HttpTypes.StoreProductListResponse> {
  return medusa.store.product.list({
    ...params,
    ...(REGION_ID ? { region_id: REGION_ID } : {}),
  } as Parameters<typeof medusa.store.product.list>[0]);
}

export async function getProduct(handle: string): Promise<HttpTypes.StoreProduct | null> {
  const { products } = await medusa.store.product.list({
    handle,
    ...(REGION_ID ? { region_id: REGION_ID } : {}),
  } as Parameters<typeof medusa.store.product.list>[0]);
  return products[0] ?? null;
}
