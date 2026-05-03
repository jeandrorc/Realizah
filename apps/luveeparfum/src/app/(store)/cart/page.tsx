'use client';

import Link from 'next/link';
import { useCart } from '@/queries/cart/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface rounded-md animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-surface rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-[48px] text-ink mb-4">CARRINHO VAZIO</h1>
        <p className="text-zinc-500 mb-8">Você ainda não adicionou nenhum produto.</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center bg-ink text-paper font-semibold px-8 py-3 rounded-md hover:bg-fire transition-colors"
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-[40px] text-ink mb-8">CARRINHO</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-card">
            {cart.items.map((item) => (
              <CartItem key={item.lineItemId} {...item} />
            ))}
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 shadow-card">
            <p className="text-sm font-semibold text-ink mb-3">Cupom de desconto</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite seu cupom"
                className="flex-1 border border-zinc-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <button className="px-4 py-2 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-fire transition-colors">
                Aplicar
              </button>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-4 text-sm text-zinc-500 hover:text-ink transition-colors"
          >
            ← Continuar comprando
          </Link>
        </div>

        <div>
          <CartSummary {...cart} />
        </div>
      </div>
    </div>
  );
}
