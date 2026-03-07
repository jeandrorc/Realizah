'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCart } from '@/queries/cart/use-cart';

export function OrderSummary() {
  const { data: cart } = useCart();
  const [collapsed, setCollapsed] = useState(true);

  if (!cart) return null;

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <button
        className="md:hidden w-full flex items-center justify-between px-6 py-4 bg-zinc-100"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-sm font-semibold text-ink">
          {collapsed ? `Ver resumo (${cart.itemCount} itens)` : 'Ocultar resumo'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>

      <div className={`${collapsed ? 'hidden md:block' : 'block'}`}>
        <div className="p-6 space-y-3">
          {cart.items.map((item) => (
            <div key={item.lineItemId} className="flex gap-3">
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-white flex-shrink-0">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
                <span className="absolute -top-1 -right-1 bg-ink text-paper text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink line-clamp-2">{item.title}</p>
                {item.variantTitle && <p className="text-xs text-zinc-500">{item.variantTitle}</p>}
              </div>
              <span className="text-xs font-bold text-ink flex-shrink-0">{item.price}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 p-6 space-y-2">
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Subtotal</span>
            <span>{cart.subtotal}</span>
          </div>
          {cart.discount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto</span>
              <span>- {cart.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Frete</span>
            <span>{cart.shipping ?? 'A calcular'}</span>
          </div>
          <div className="flex justify-between font-bold text-ink border-t border-zinc-200 pt-2">
            <span>Total</span>
            <span>{cart.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
