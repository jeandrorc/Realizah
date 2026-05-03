import { CategoryBanner } from '@/components/category/category-banner';
import { ProductListMounter } from '@/mounters/product/product-list.mounter';
import { getMockCategory } from '@/lib/mock/categories';
import { adaptCategory } from '@/adapters/category.adapter';
import { getCategoryByHandle } from '@/lib/api/categories';
import { Suspense } from 'react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const medusaCat = await getCategoryByHandle(slug);
  const mockCat = getMockCategory(slug);
  const name = medusaCat?.name ?? mockCat?.title ?? slug.replace(/-/g, ' ');
  const desc = medusaCat?.description ?? mockCat?.description ?? `Produtos da categoria ${slug}.`;
  return {
    title: `${name} — Compre online`,
    description: desc,
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try Medusa first, fallback to mock
  const medusaCat = await getCategoryByHandle(slug);
  const mockCat = getMockCategory(slug);

  const category = medusaCat
    ? adaptCategory({
        id: medusaCat.id,
        name: medusaCat.name,
        handle: medusaCat.handle,
        description: medusaCat.description,
      })
    : (mockCat ??
      adaptCategory({
        id: slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        handle: slug,
        description: `Explore nossa seleção de ${slug}`,
      }));

  return (
    <>
      <CategoryBanner {...category} />
      <section className="container mx-auto px-4 py-8">
        <Suspense fallback={<GridSkeleton />}>
          <ProductListMounter
            categoryId={medusaCat?.id}
            categorySlug={!medusaCat ? slug : undefined}
          />
        </Suspense>
      </section>
    </>
  );
}
