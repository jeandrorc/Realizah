import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';

export const metadata: Metadata = {
  title: 'Finalizar Compra',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="font-display text-2xl text-paper tracking-wider">REALIZAH</span>
          </Link>
          <span className="text-zinc-400 text-sm flex items-center gap-1.5">
            🔒 Compra 100% segura
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <div className="lg:col-span-3">
            <CheckoutForm />
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
