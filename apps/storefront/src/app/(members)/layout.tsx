import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { MembersSidebar } from '@/components/members/sidebar';

export default function MembersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <MembersSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
