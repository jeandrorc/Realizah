export interface BrandHeroProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  externalUrl?: string;
}

export function adaptBrand(raw: Record<string, unknown>): BrandHeroProps {
  const metadata = raw.metadata as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    title: (raw.title ?? raw.name ?? '') as string,
    slug: (raw.handle ?? raw.id) as string,
    description: raw.description as string | undefined,
    logoUrl: metadata?.logo as string | undefined,
    coverUrl: (metadata?.cover ?? raw.thumbnail) as string | undefined,
    externalUrl: metadata?.website as string | undefined,
  };
}
