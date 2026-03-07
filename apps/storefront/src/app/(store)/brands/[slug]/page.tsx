import { BrandHero } from '@/components/brand/brand-hero';
import { ProductListMounter } from '@/mounters/product/product-list.mounter';
import { getMockBrand } from '@/lib/mock/brands';
import { adaptBrand } from '@/adapters/brand.adapter';
import { Suspense } from 'react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getMockBrand(slug);
  return {
    title: brand ? `${brand.title} — Produtos oficiais` : `${slug} — Produtos oficiais`,
    description: brand?.description ?? `Todos os produtos oficiais da marca ${slug}.`,
  };
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-surface rounded-md h-64 animate-pulse" />
      ))}
    </div>
  );
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const mockBrand = getMockBrand(slug);

  const brand =
    mockBrand ??
    adaptBrand({
      id: slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      handle: slug,
      description: `Produtos originais da marca ${slug}`,
    });

  return (
    <>
      <BrandHero {...brand} />
      <section className="container mx-auto px-4 py-8">
        <Suspense fallback={<GridSkeleton />}>
          <ProductListMounter brandName={brand.title} />
        </Suspense>
      </section>
    </>
  );
}
