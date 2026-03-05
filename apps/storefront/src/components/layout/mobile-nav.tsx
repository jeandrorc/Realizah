'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, BookOpen, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navLinks = [
  { href: '/products', label: 'Loja', icon: ShoppingBag },
  { href: '/courses', label: 'Cursos', icon: BookOpen },
  { href: '/subscription', label: 'Planos', icon: CreditCard },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background border-t">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-base"
              >
                <link.icon className="h-5 w-5 text-muted-foreground" />
                {link.label}
              </Link>
            ))}
            <Separator className="my-3" />
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-base"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              Entrar / Conta
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-base"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              Área de Membros
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
