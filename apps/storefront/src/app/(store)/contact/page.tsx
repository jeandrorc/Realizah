import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Realizah.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="font-display text-[40px] text-ink mb-8">Contato</h1>
      <div className="space-y-6 text-zinc-600">
        <p>Estamos à disposição para ajudar. Entre em contato pelos canais abaixo:</p>
        <ul className="space-y-2">
          <li>
            <strong>E-mail:</strong> contato@realizah.com.br
          </li>
          <li>
            <strong>Horário:</strong> Segunda a sexta, 9h às 18h
          </li>
        </ul>
        <p className="text-sm text-zinc-500">Respondemos em até 24 horas úteis.</p>
      </div>
    </div>
  );
}
