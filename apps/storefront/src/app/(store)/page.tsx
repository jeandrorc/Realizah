import Link from 'next/link';
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { OffersCountdown } from '@/components/home/offers-countdown';
import { SubscriptionBanner } from '@/components/home/subscription-banner';
import { ProductListMounter } from '@/mounters/product/product-list.mounter';
import { CategoryListMounter } from '@/mounters/category/category-list.mounter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realizah — Produtos, Cursos e Assinaturas',
  description: 'Sua plataforma de produtos físicos, cursos online e assinaturas premium.',
  openGraph: {
    title: 'Realizah',
    description: 'Produtos, cursos e assinaturas em um só lugar.',
    type: 'website',
  },
};

function getTodayMidnight() {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d;
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface rounded-md h-64 animate-pulse" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Quick categories */}
      <section className="container mx-auto px-4 pt-8 pb-4">
        <Suspense
          fallback={
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 h-16 bg-surface rounded-lg animate-pulse"
                />
              ))}
            </div>
          }
        >
          <CategoryListMounter />
        </Suspense>
      </section>

      {/* Ofertas do dia */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <OffersCountdown endsAt={getTodayMidnight()} />
          <Link href="/products" className="text-sm text-fire font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductListMounter limit={4} featured columns={4} />
        </Suspense>
      </section>

      {/* Todos os produtos */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-[32px] text-ink">MAIS VENDIDOS</h2>
          <Link href="/products" className="text-sm text-zinc-500 hover:text-ink transition-colors">
            Ver catálogo →
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductListMounter limit={8} columns={4} />
        </Suspense>
      </section>

      <SubscriptionBanner />
    </>
  );
}
