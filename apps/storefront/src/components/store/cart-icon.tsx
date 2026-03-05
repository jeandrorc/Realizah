'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';

export function CartIcon() {
  const { itemCount, initCart } = useCartStore();

  useEffect(() => {
    initCart();
  }, [initCart]);

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart" aria-label="Carrinho de compras">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {itemCount > 9 ? '9+' : itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
