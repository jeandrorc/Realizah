import Link from 'next/link';

export function SubscriptionBanner() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="bg-ink rounded-[16px] px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sun text-xs font-semibold uppercase tracking-widest mb-2">
            Plano Premium
          </p>
          <h2 className="font-display text-[40px] md:text-[56px] text-paper leading-tight">
            ASSINE E ECONOMIZE
            <br />
            ATÉ 30%
          </h2>
          <p className="text-zinc-400 mt-3 max-w-md">
            Acesso ilimitado a cursos, frete grátis e descontos exclusivos em todos os produtos.
          </p>
        </div>
        <Link
          href="/subscription"
          className="flex-shrink-0 inline-flex items-center justify-center bg-sun text-ink font-semibold px-10 py-4 rounded-md hover:bg-yellow-400 transition-colors text-base"
        >
          Assinar agora
        </Link>
      </div>
    </section>
  );
}
