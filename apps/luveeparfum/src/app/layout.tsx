import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { BASE_URL } from '@/lib/config';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Luvée Parfum',
    default: 'Luvée Parfum — Art de Parfum Artesanal',
  },
  description:
    'Sabonetes artesanais, velas perfumadas, perfumes e aromas para casa. Ritual de bem-estar com ingredientes naturais.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Luvée Parfum',
    title: 'Luvée Parfum — Art de Parfum Artesanal',
    description:
      'Sabonetes artesanais, velas perfumadas, perfumes e aromas para casa. Ritual de bem-estar com ingredientes naturais.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luvée Parfum',
    description: 'Art de parfum artesanal — rituais de bem-estar com ingredientes naturais.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${cormorantGaramond.variable} ${inter.variable}`}
    >
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
