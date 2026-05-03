import Link from 'next/link';

const footerLinks = {
  loja: [
    { label: 'Produtos', href: '/products' },
    { label: 'Cursos', href: '/courses' },
    { label: 'Assinatura', href: '/subscription' },
  ],
  ajuda: [
    { label: 'Minha Conta', href: '/dashboard' },
    { label: 'Meus Pedidos', href: '/orders' },
    { label: 'Trocas e Devoluções', href: '/returns' },
    { label: 'Contato', href: '/contact' },
  ],
  empresa: [
    { label: 'Sobre nós', href: '/about' },
    { label: 'Termos de Uso', href: '/terms' },
    { label: 'Privacidade', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl tracking-wider">REALIZAH</span>
            <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
              Sua plataforma de produtos, cursos e assinaturas.
            </p>
          </div>

          {/* Loja */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Loja
            </h3>
            <ul className="space-y-2">
              {footerLinks.loja.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 hover:text-paper transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Ajuda
            </h3>
            <ul className="space-y-2">
              {footerLinks.ajuda.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 hover:text-paper transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 hover:text-paper transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Realizah. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-600 bg-zinc-800 px-3 py-1 rounded-sm">
              🔒 Pagamento Seguro
            </span>
            <span className="text-xs text-zinc-600 bg-zinc-800 px-3 py-1 rounded-sm">
              ✓ Mercado Pago
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
