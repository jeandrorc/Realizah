import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Realizah
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:text-primary transition-colors">
            Loja
          </Link>
          <Link href="/courses" className="hover:text-primary transition-colors">
            Cursos
          </Link>
          <Link href="/subscription" className="hover:text-primary transition-colors">
            Planos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login" aria-label="Entrar na conta">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
