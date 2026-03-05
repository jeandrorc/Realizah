import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = { title: 'Assinatura' };

interface Plan {
  id: string;
  name: string;
  tier: 'free' | 'pro' | 'premium';
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

const defaultPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    price: 0,
    interval: 'monthly',
    features: ['Acesso a cursos gratuitos', 'Downloads de materiais free', 'Suporte por email'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    price: 9900,
    interval: 'monthly',
    features: [
      'Tudo do plano Free',
      'Acesso a todos os cursos Pro',
      'Downloads ilimitados',
      'Suporte prioritário',
      'Certificados de conclusão',
    ],
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    price: 19900,
    interval: 'monthly',
    features: [
      'Tudo do plano Pro',
      'Acesso antecipado a novos cursos',
      'Mentoria mensal em grupo',
      'Certificados personalizados',
      'Acesso a ferramentas Premium',
    ],
  },
];

async function getActivePlans(): Promise<Plan[]> {
  try {
    const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000';
    const res = await fetch(`${MEDUSA_URL}/store/subscription-plans`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return defaultPlans;
    const { plans } = await res.json();
    return (plans as Plan[]) ?? defaultPlans;
  } catch {
    return defaultPlans;
  }
}

export default async function SubscriptionPage() {
  const plans = await getActivePlans();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground mt-1">Escolha o plano ideal para você.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.isPopular ? 'border-primary shadow-lg relative' : 'relative'}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Mais Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">{plan.name}</CardTitle>
              <CardDescription>
                {plan.price === 0 ? (
                  <span className="text-2xl font-bold text-foreground">Grátis</span>
                ) : (
                  <span className="text-2xl font-bold text-foreground">
                    R${' '}
                    {(plan.price / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.interval === 'monthly' ? '/mês' : '/ano'}
                    </span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.isPopular ? 'default' : 'outline'}
                disabled={plan.price === 0}
              >
                {plan.price === 0 ? 'Plano Atual' : `Assinar ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="rounded-lg border bg-muted/20 p-6">
        <h2 className="font-semibold mb-2">Como funciona?</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Pagamentos processados via Mercado Pago (PIX, cartão, boleto)</li>
          <li>• Assinatura mensal com renovação automática</li>
          <li>• Cancele a qualquer momento sem multa</li>
          <li>• Acesso imediato após confirmação do pagamento</li>
        </ul>
      </div>
    </div>
  );
}
