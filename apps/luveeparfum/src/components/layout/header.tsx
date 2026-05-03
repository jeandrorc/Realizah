'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/mock/menu';

const NAV_LINKS = [
  { label: 'Sabonetes', href: '/categories/sabonetes' },
  { label: 'Velas', href: '/categories/velas' },
  { label: 'Perfumes', href: '/categories/perfumes' },
  { label: 'Aromas', href: '/categories/aromas' },
  { label: 'Kits', href: '/categories/kits' },
  { label: 'Sobre', href: '/about' },
];

interface HeaderProps {
  children?: ReactNode;
  menuItems?: MenuItem[];
}

export function Header({ children, menuItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-offwhite text-cacau transition-shadow duration-300',
        scrolled ? 'shadow-[0_2px_16px_rgba(78,58,45,0.10)]' : 'border-b border-nude/40',
      )}
    >
      {/* Topbar */}
      <div className="bg-cacau text-cream text-xs font-medium text-center py-2 px-4 tracking-wide">
        🌿 Frete grátis em compras acima de R$&nbsp;199 ·{' '}
        <Link
          href="/products"
          className="underline underline-offset-2 hover:text-dourado transition-colors"
        >
          Explorar aromas
        </Link>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex flex-col leading-none">
            <span className="font-display text-2xl text-cacau tracking-[0.08em]">Luvée Parfum</span>
            <span className="font-display italic text-[10px] text-dourado tracking-[0.18em] mt-[-2px]">
              art de parfum
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7 flex-shrink-0">
            {children ?? (
              <>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-cacau/70 hover:text-cacau transition-colors tracking-wide font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              className="p-2 text-cacau/60 hover:text-cacau transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/wishlist"
              className="p-2 text-cacau/60 hover:text-cacau transition-colors hidden md:block"
              aria-label="Lista de desejos"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-cacau/60 hover:text-cacau transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 bg-terracota text-cream text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            <button
              className="md:hidden p-2 text-cacau/60 hover:text-cacau transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar expandida */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cacau/40 w-4 h-4" />
              <input
                type="search"
                placeholder="Buscar sabonetes, velas, perfumes..."
                className="w-full bg-cream text-cacau placeholder-cacau/40 border border-nude rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dourado/40 transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-offwhite border-t border-nude/40">
          <nav className="container mx-auto px-4 py-5 flex flex-col gap-1">
            {menuItems && menuItems.length > 0
              ? menuItems
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item) => {
                    if (item.children?.length) {
                      return (
                        <div key={item.id} className="border-b border-nude/30 pb-2 mb-1">
                          <span className="text-sm font-semibold text-cacau block py-2 tracking-wide">
                            {item.label}
                          </span>
                          <div className="flex flex-col gap-1 pl-3">
                            {item.children.map((c) => (
                              <Link
                                key={c.id}
                                href={
                                  c.href ?? (c.categorySlug ? `/categories/${c.categorySlug}` : '#')
                                }
                                className="text-sm text-cacau/60 hover:text-cacau py-1"
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
                        className="text-sm text-cacau/80 hover:text-cacau py-3 border-b border-nude/30 flex items-center justify-between"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                        {item.badge && (
                          <span className="bg-terracota text-cream text-xs px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })
              : NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-cacau/80 hover:text-cacau py-3 border-b border-nude/30 tracking-wide"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
            <Link
              href="/wishlist"
              className="text-sm text-cacau/80 hover:text-cacau py-3 flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className="w-4 h-4" /> Lista de desejos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
