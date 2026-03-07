const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_API_URL ??
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
  'http://localhost:9000';

const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '';

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  rank: number;
  parent_category_id: string | null;
  category_children: MedusaCategory[];
}

interface CategoriesResponse {
  product_categories: MedusaCategory[];
  count: number;
}

export async function listCategories(params?: {
  limit?: number;
  parent_category_id?: string | null;
  include_descendants_tree?: boolean;
}): Promise<MedusaCategory[]> {
  try {
    const url = new URL(`${MEDUSA_URL}/store/product-categories`);
    url.searchParams.set('limit', String(params?.limit ?? 50));
    if (params?.parent_category_id === null) {
      url.searchParams.set('parent_category_id', 'null');
    } else if (params?.parent_category_id) {
      url.searchParams.set('parent_category_id', params.parent_category_id);
    }
    if (params?.include_descendants_tree) {
      url.searchParams.set('include_descendants_tree', 'true');
    }
    url.searchParams.set('fields', 'id,name,handle,description,rank,parent_category_id');

    const res = await fetch(url.toString(), {
      headers: { 'x-publishable-api-key': PUB_KEY },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as CategoriesResponse;
    return (data.product_categories ?? []).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  } catch {
    return [];
  }
}

export async function getCategoryByHandle(handle: string): Promise<MedusaCategory | null> {
  try {
    const url = new URL(`${MEDUSA_URL}/store/product-categories`);
    url.searchParams.set('handle', handle);
    url.searchParams.set('fields', 'id,name,handle,description,rank,parent_category_id');

    const res = await fetch(url.toString(), {
      headers: { 'x-publishable-api-key': PUB_KEY },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as CategoriesResponse;
    return data.product_categories?.[0] ?? null;
  } catch {
    return null;
  }
}
