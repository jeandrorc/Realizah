import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trocas e Devoluções',
  description: 'Política de trocas e devoluções da Realizah.',
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="font-display text-[40px] text-ink mb-8">Trocas e Devoluções</h1>
      <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
        <p>
          Você tem até <strong>7 dias</strong> a partir da data de recebimento para solicitar troca
          ou devolução de produtos em perfeito estado.
        </p>
        <p>
          Para iniciar o processo, acesse sua conta, vá em Meus Pedidos e selecione o item desejado.
        </p>
        <p>
          Produtos digitais e cursos seguem política específica — consulte os termos de cada
          produto.
        </p>
      </div>
    </div>
  );
}
