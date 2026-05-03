import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { MegaMenuMounter } from '@/mounters/layout/mega-menu.mounter';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<Header />}>
        <MegaMenuMounter />
      </Suspense>
      <main className="pt-[96px] min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
