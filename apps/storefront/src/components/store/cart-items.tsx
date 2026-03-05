'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { getCart } from '@/lib/api/cart';
import { formatCurrency } from '@/lib/utils';
import type { HttpTypes } from '@medusajs/types';

type LineItem = HttpTypes.StoreCartLineItem;

export function CartItems() {
  const { cartId, removeItem } = useCartStore();
  const [items, setItems] = useState<LineItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!cartId) {
      setIsLoading(false);
      return;
    }
    getCart(cartId)
      .then((cart) => {
        setItems((cart.items as LineItem[]) ?? []);
        setTotal(cart.total ?? 0);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setIsLoading(false));
  }, [cartId]);

  const handleRemove = async (lineItemId: string) => {
    setRemovingId(lineItemId);
    await removeItem(lineItemId);
    setItems((prev) => prev.filter((i) => i.id !== lineItemId));
    setRemovingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground mb-4">Seu carrinho está vazio.</p>
        <Button asChild>
          <Link href="/products">Explorar Produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="w-20 h-20 bg-muted rounded-md overflow-hidden shrink-0">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title ?? 'Produto'}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.title}</h3>
              {item.variant?.title && (
                <p className="text-sm text-muted-foreground">{item.variant.title}</p>
              )}
              <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
              {item.subtotal != null && (
                <p className="font-semibold mt-1">{formatCurrency(item.subtotal, 'BRL')}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              disabled={removingId === item.id}
              aria-label="Remover item"
            >
              {removingId === item.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex items-center justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{formatCurrency(total, 'BRL')}</span>
      </div>
      <Button size="lg" className="w-full" asChild>
        <Link href="/checkout">Finalizar Compra</Link>
      </Button>
    </div>
  );
}
