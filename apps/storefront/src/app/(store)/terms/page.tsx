import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da plataforma Realizah.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="font-display text-[40px] text-ink mb-8">Termos de Uso</h1>
      <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
        <p>
          Ao utilizar a plataforma Realizah, você concorda com os termos e condições aqui descritos.
        </p>
        <p>
          O uso dos serviços implica na aceitação integral destes termos. Recomendamos a leitura
          completa antes de realizar compras ou matrículas.
        </p>
        <p className="text-sm text-zinc-500">
          Em caso de dúvidas, entre em contato através da página de Contato.
        </p>
      </div>
    </div>
  );
}
