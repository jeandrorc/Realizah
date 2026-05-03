export interface CategoryBannerProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export function adaptCategory(raw: Record<string, unknown>): CategoryBannerProps {
  return {
    id: raw.id as string,
    title: (raw.name ?? raw.title ?? '') as string,
    slug: (raw.handle ?? raw.id) as string,
    description: raw.description as string | undefined,
    imageUrl: (raw.thumbnail ?? (raw.metadata as Record<string, unknown>)?.image) as
      | string
      | undefined,
    productCount: raw.product_count as number | undefined,
  };
}
