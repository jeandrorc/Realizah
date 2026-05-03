import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SubscriptionBanner() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-primary text-primary-foreground p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Acesse tudo com um plano Pro</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Cursos ilimitados, downloads sem restrições e suporte prioritário. Comece hoje.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/subscription">Ver Planos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
