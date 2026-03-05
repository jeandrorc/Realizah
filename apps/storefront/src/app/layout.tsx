import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://realizah.com';

export const metadata: Metadata = {
  title: {
    template: '%s | Realizah',
    default: 'Realizah — E-commerce, Cursos e Produtos Digitais',
  },
  description:
    'Plataforma de e-commerce, cursos e produtos digitais para acelerar seu crescimento.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Realizah',
    title: 'Realizah — E-commerce, Cursos e Produtos Digitais',
    description:
      'Plataforma de e-commerce, cursos e produtos digitais para acelerar seu crescimento.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Realizah',
    description: 'Plataforma de e-commerce, cursos e produtos digitais.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
