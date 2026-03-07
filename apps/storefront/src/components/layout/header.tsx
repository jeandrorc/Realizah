'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Heart, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/mock/menu';

const FALLBACK_NAV_LINKS = [
  { label: 'Produtos', href: '/products' },
  { label: 'Cursos', href: '/courses' },
  { label: 'Assinatura', href: '/subscription' },
];

interface HeaderProps {
  children?: ReactNode;
  menuItems?: MenuItem[];
}

export function Header({ children, menuItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink text-paper shadow-md">
      {/* Topbar oferta */}
      <div className="bg-sun text-ink text-xs font-semibold text-center py-1.5 px-4">
        🔥 Frete grátis em compras acima de R$ 199 ·{' '}
        <Link href="/products" className="underline">
          Ver ofertas
        </Link>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-display text-2xl text-paper tracking-wider">REALIZAH</span>
          </Link>

          {/* Busca — expansível desktop */}
          <div className={cn('hidden md:flex flex-1 max-w-2xl mx-4', searchOpen && 'flex')}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Buscar produtos, cursos..."
                className="w-full bg-zinc-800 text-paper placeholder-zinc-500 rounded-pill pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sun transition-all"
              />
            </div>
          </div>

          {/* Nav desktop — MegaMenu ou fallback */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            {children ?? (
              <>
                {FALLBACK_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-paper transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <button
              className="md:hidden text-zinc-300 hover:text-paper p-1"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/dashboard"
              className="text-zinc-300 hover:text-paper p-1 hidden md:block"
              aria-label="Minha conta"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/wishlist"
              className="text-zinc-300 hover:text-paper p-1 hidden md:block"
              aria-label="Lista de desejos"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative text-zinc-300 hover:text-paper p-1"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-fire text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            <button
              className="md:hidden text-zinc-300 hover:text-paper p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Busca mobile expandida */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Buscar produtos, cursos..."
                className="w-full bg-zinc-800 text-paper placeholder-zinc-500 rounded-pill pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sun"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Menu mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-700">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {menuItems && menuItems.length > 0
              ? menuItems
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item) => {
                    if (item.children?.length) {
                      return (
                        <div key={item.id} className="border-b border-zinc-800 pb-2">
                          <span className="text-sm font-semibold text-paper block py-2">
                            {item.label}
                          </span>
                          <div className="flex flex-col gap-1 pl-3">
                            {item.children.map((c) => (
                              <Link
                                key={c.id}
                                href={
                                  c.href ?? (c.categorySlug ? `/categories/${c.categorySlug}` : '#')
                                }
                                className="text-sm text-zinc-400 hover:text-paper py-1"
                                onClick={() => setMobileOpen(false)}
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    const href =
                      item.href ?? (item.categorySlug ? `/categories/${item.categorySlug}` : '#');
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        className="text-sm text-zinc-300 hover:text-paper py-2 border-b border-zinc-800 flex items-center gap-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                        {item.badge && (
                          <span className="bg-fire text-white text-xs px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })
              : FALLBACK_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-paper transition-colors py-2 border-b border-zinc-800"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
            <Link
              href="/dashboard"
              className="text-sm text-zinc-300 hover:text-paper py-2"
              onClick={() => setMobileOpen(false)}
            >
              Minha Conta
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
