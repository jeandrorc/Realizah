import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
          <CardDescription>Bem-vindo de volta à Realizah</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-10 animate-pulse rounded bg-muted" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
