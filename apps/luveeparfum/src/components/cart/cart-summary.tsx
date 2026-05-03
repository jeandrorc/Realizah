import Link from 'next/link';
import type { CartSummaryProps } from '@/adapters/cart.adapter';

interface CartSummaryComponentProps extends CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({
  subtotal,
  discount,
  shipping,
  total,
  showCheckoutButton = true,
}: CartSummaryComponentProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h2 className="font-display text-2xl text-ink mb-4">RESUMO</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span>{subtotal}</span>
        </div>
        {discount && (
          <div className="flex justify-between text-green-600">
            <span>Desconto</span>
            <span>- {discount}</span>
          </div>
        )}
        <div className="flex justify-between text-zinc-600">
          <span>Frete</span>
          <span>{shipping ?? 'Calcular no checkout'}</span>
        </div>
        <div className="flex justify-between font-bold text-ink text-base border-t border-zinc-200 pt-3">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-6 flex items-center justify-center w-full bg-ink text-paper font-semibold py-4 rounded-md hover:bg-fire transition-colors duration-200"
        >
          Finalizar Compra →
        </Link>
      )}
    </div>
  );
}
