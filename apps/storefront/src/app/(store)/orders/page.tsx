import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meus Pedidos',
  description: 'Acompanhe seus pedidos e histórico de compras.',
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-[40px] text-ink mb-4">MEUS PEDIDOS</h1>
      <p className="text-zinc-500 mb-8 max-w-md mx-auto">
        Nenhum pedido encontrado. Suas compras aparecerão aqui.
      </p>
    </div>
  );
}
