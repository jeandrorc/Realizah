import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-24 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Aprenda. Acesse. <span className="text-primary">Evolua.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Cursos, produtos digitais e ferramentas para acelerar seu crescimento. Tudo em um só
          lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/courses">Ver Cursos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/subscription">Ver Planos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
