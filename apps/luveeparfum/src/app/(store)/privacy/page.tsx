import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidade',
  description: 'Política de privacidade da Realizah.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="font-display text-[40px] text-ink mb-8">Privacidade</h1>
      <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
        <p>
          A Realizah respeita sua privacidade e está comprometida com a proteção dos seus dados
          pessoais.
        </p>
        <p>
          Coletamos apenas as informações necessárias para processar pedidos, matrículas e melhorar
          sua experiência. Seus dados não são compartilhados com terceiros para fins de marketing
          sem seu consentimento.
        </p>
        <p className="text-sm text-zinc-500">
          Para mais informações sobre o tratamento de dados, entre em contato.
        </p>
      </div>
    </div>
  );
}
