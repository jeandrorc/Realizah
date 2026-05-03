'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/providers/query-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
