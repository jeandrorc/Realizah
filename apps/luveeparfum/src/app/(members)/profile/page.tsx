import type { Metadata } from 'next';
import { getCustomer } from '@/lib/api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileForm } from '@/components/members/profile-form';

export const metadata: Metadata = { title: 'Perfil' };

export default async function ProfilePage() {
  const customer = await getCustomer();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize suas informações de conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              first_name: customer?.first_name ?? '',
              last_name: customer?.last_name ?? '',
              email: customer?.email ?? '',
              phone: customer?.phone ?? '',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
