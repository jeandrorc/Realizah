import type { Metadata } from 'next';
import { BookOpen, Download, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCustomer } from '@/lib/api/auth';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const customer = await getCustomer();

  const displayName = customer?.first_name ?? customer?.email?.split('@')[0] ?? 'Membro';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {displayName}!</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo à sua área de membros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">cursos matriculados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">produtos digitais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinatura</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Free</div>
            <p className="text-xs text-muted-foreground mt-1">plano atual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/my-courses"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" /> Ver meus cursos
            </a>
            <a
              href="/my-downloads"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4" /> Ver meus downloads
            </a>
            <a
              href="/subscription"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <CreditCard className="h-4 w-4" /> Gerenciar assinatura
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Explorar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/courses"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" /> Catálogo de cursos
            </a>
            <a
              href="/products"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4" /> Ver produtos
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
