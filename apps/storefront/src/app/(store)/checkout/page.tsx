import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Finalizar Compra' };

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>
            <p className="text-muted-foreground text-sm">
              O formulário de checkout com integração ao Mercado Pago será implementado na Fase 6b
              após a configuração dos webhooks de pagamento.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md text-sm text-muted-foreground">
              🚧 Integração com Mercado Pago (Fase 5) necessária para processar pagamentos.
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
            <p className="text-sm text-muted-foreground">Revise seu carrinho antes de finalizar.</p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/cart">← Voltar ao Carrinho</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
