'use client';

import type React from 'react';
import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <section className="bg-cacau py-20 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <p className="font-display italic text-dourado text-lg mb-3">fique por dentro</p>
        <h2 className="font-display text-[48px] md:text-[60px] text-cream leading-tight mb-4">
          Receba nosso mundo
        </h2>
        <p className="text-cream/55 mb-10">
          Novidades, receitas de bem-estar, lançamentos exclusivos e 10% off na primeira compra.
        </p>

        {done ? (
          <p className="text-dourado font-display text-2xl">✓ Obrigada! Você está na lista.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="flex-1 bg-white/10 border border-white/20 text-cream placeholder-cream/40 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dourado/50"
            />
            <button
              type="submit"
              className="bg-dourado text-cacau font-medium px-6 py-3 rounded-full hover:bg-dourado/85 transition-colors text-sm tracking-wide whitespace-nowrap"
            >
              Quero receber
            </button>
          </form>
        )}

        <p className="text-cream/30 text-xs mt-4">Sem spam. Cancele quando quiser.</p>
      </div>
    </section>
  );
}
