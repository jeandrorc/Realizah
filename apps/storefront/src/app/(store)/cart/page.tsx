import type { Metadata } from 'next';
import { CartItems } from '@/components/store/cart-items';

export const metadata: Metadata = { title: 'Carrinho' };

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Carrinho</h1>
      <CartItems />
    </div>
  );
}
