'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
}

export function AddToCartButton({ variantId, quantity = 1 }: AddToCartButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = async () => {
    setStatus('loading');
    try {
      await addItem(variantId, quantity);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <Button size="lg" onClick={handleAdd} disabled={status === 'loading'} className="w-full">
      {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
      {status === 'success' && <Check className="h-5 w-5 mr-2" />}
      {status === 'idle' && <ShoppingCart className="h-5 w-5 mr-2" />}
      {status === 'loading'
        ? 'Adicionando...'
        : status === 'success'
          ? 'Adicionado!'
          : 'Adicionar ao Carrinho'}
    </Button>
  );
}
