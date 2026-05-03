'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'Os ingredientes são realmente naturais?',
    a: 'Sim. Utilizamos óleos essenciais puros, manteigas vegetais, argila natural e extratos botânicos certificados. Não há parabenos, sulfatos ou fragrâncias sintéticas em nossa linha principal.',
  },
  {
    q: 'Como conservar os produtos Luvée?',
    a: 'Guarde em local fresco e seco, longe da luz solar direta. Sabonetes duram até 12 meses; velas têm validade de 24 meses. Após abrir os óleos, consuma em até 6 meses para preservar as propriedades aromáticas.',
  },
  {
    q: 'Vocês fazem entregas para todo o Brasil?',
    a: 'Sim! Entregamos para todo o território nacional via Correios e transportadoras parceiras. Frete grátis em pedidos acima de R$ 199. O prazo médio é de 5 a 10 dias úteis.',
  },
  {
    q: 'Posso presentear com embalagem especial?',
    a: 'Todos os kits presenteáveis já vêm em embalagem premium com laço e cartão personalizado. Para pedidos avulsos, adicione a opção de embalagem de presente no carrinho por apenas R$ 15.',
  },
  {
    q: 'Qual é a política de trocas e devoluções?',
    a: 'Aceitamos trocas e devoluções em até 7 dias corridos após o recebimento, desde que o produto esteja lacrado e sem uso. Entre em contato pelo WhatsApp ou e-mail para iniciar o processo.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <p className="font-display italic text-dourado text-lg mb-2">tire suas dúvidas</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="border border-nude/50 rounded-2xl overflow-hidden bg-offwhite transition-shadow hover:shadow-card"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-display text-xl text-cacau pr-4">{item.q}</span>
                <span className="flex-shrink-0 text-dourado">
                  {open === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-cacau/65 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
