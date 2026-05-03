import Link from 'next/link';

const footerLinks = {
  loja: [
    { label: 'Sabonetes', href: '/categories/sabonetes' },
    { label: 'Velas', href: '/categories/velas' },
    { label: 'Perfumes', href: '/categories/perfumes' },
    { label: 'Aromas para Casa', href: '/categories/aromas' },
    { label: 'Kits Presenteáveis', href: '/categories/kits' },
  ],
  ajuda: [
    { label: 'Minha Conta', href: '/dashboard' },
    { label: 'Meus Pedidos', href: '/orders' },
    { label: 'Trocas e Devoluções', href: '/returns' },
    { label: 'Contato', href: '/contact' },
  ],
  empresa: [
    { label: 'Nossa História', href: '/about' },
    { label: 'Termos de Uso', href: '/terms' },
    { label: 'Privacidade', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cacau text-cream/80">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <span className="font-display text-2xl text-cream tracking-[0.08em]">
                Luvée Parfum
              </span>
              <p className="font-display italic text-[10px] text-dourado tracking-[0.18em] mt-[-2px]">
                art de parfum
              </p>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed mt-3">
              Sabonetes artesanais, velas perfumadas e aromas para casa — rituais de bem-estar com
              ingredientes naturais.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Instagram', href: 'https://instagram.com/luveeparfum' },
                { label: 'TikTok', href: 'https://tiktok.com/@luveeparfum' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/50 px-3 py-1.5 rounded-full transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Loja */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-dourado mb-4">
              Loja
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.loja.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/55 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-dourado mb-4">
              Ajuda
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.ajuda.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/55 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-dourado mb-4">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/55 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} Luvée Parfum. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cream/40 border border-cream/10 px-3 py-1 rounded-full">
              🔒 Pagamento Seguro
            </span>
            <span className="text-xs text-cream/40 border border-cream/10 px-3 py-1 rounded-full">
              ✓ Mercado Pago
            </span>
            <span className="text-xs text-cream/40 border border-cream/10 px-3 py-1 rounded-full">
              🌿 Natural
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
