import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Realizah</h3>
          <p className="text-sm text-muted-foreground">
            Plataforma de e-commerce, cursos e produtos digitais.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Loja</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-primary transition-colors">
                Produtos
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-primary transition-colors">
                Cursos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Conta</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/login" className="hover:text-primary transition-colors">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary transition-colors">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Área de membros
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Planos</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/subscription" className="hover:text-primary transition-colors">
                Ver planos
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Realizah. Todos os direitos reservados.
      </div>
    </footer>
  );
}
