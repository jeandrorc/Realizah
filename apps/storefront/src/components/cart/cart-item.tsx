'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import type { CartItemProps } from '@/adapters/cart.adapter';
import { useUpdateCartItem, useRemoveCartItem } from '@/queries/cart/use-cart';

export function CartItem({
  lineItemId,
  title,
  variantTitle,
  imageUrl,
  price,
  quantity,
  handle,
}: CartItemProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  return (
    <div className="flex gap-4 py-4 border-b border-zinc-100 last:border-0">
      <Link href={`/products/${handle}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-surface">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-200" />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${handle}`}>
          <h3 className="text-sm font-medium text-ink hover:text-fire transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        {variantTitle && <p className="text-xs text-zinc-500 mt-0.5">{variantTitle}</p>}

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-zinc-200 rounded-sm">
            <button
              onClick={() =>
                quantity > 1
                  ? updateItem.mutate({ lineItemId, quantity: quantity - 1 })
                  : removeItem.mutate(lineItemId)
              }
              disabled={updateItem.isPending || removeItem.isPending}
              className="px-2 py-1 text-ink hover:bg-surface font-bold text-sm disabled:opacity-50"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="text-sm font-medium text-ink w-8 text-center">{quantity}</span>
            <button
              onClick={() => updateItem.mutate({ lineItemId, quantity: quantity + 1 })}
              disabled={updateItem.isPending}
              className="px-2 py-1 text-ink hover:bg-surface font-bold text-sm disabled:opacity-50"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem.mutate(lineItemId)}
            disabled={removeItem.isPending}
            className="text-zinc-400 hover:text-fire transition-colors disabled:opacity-50"
            aria-label="Remover item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-ink">{price}</span>
      </div>
    </div>
  );
}
