import type { Metadata } from 'next';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MEDUSA_URL } from '@/lib/config';

export const metadata: Metadata = { title: 'Meus Downloads' };

interface DigitalPurchase {
  id: string;
  status: 'active' | 'pending' | 'expired' | 'revoked';
  downloadCount: number;
  product?: {
    id: string;
    name: string;
    type?: string;
    files?: Array<{ id: string; name: string; fileSize: number }>;
  };
}

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  active: { label: 'Disponível', variant: 'default' },
  pending: { label: 'Pendente', variant: 'secondary' },
  expired: { label: 'Expirado', variant: 'outline' },
  revoked: { label: 'Revogado', variant: 'destructive' },
};

async function getMyDownloads(): Promise<DigitalPurchase[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/my-digital-products`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return [];
    const { purchases } = await res.json();
    return (purchases as DigitalPurchase[]) ?? [];
  } catch {
    return [];
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MyDownloadsPage() {
  const purchases = await getMyDownloads();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus Downloads</h1>
        <p className="text-muted-foreground mt-1">Seus produtos digitais adquiridos.</p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-20 rounded-lg border border-dashed">
          <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground mb-2">Nenhum produto digital adquirido.</p>
          <p className="text-sm text-muted-foreground mb-6">
            Adquira produtos digitais na loja para acessá-los aqui.
          </p>
          <Button asChild>
            <Link href="/products">Ver Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const statusInfo = statusConfig[purchase.status] ?? {
              label: 'Disponível',
              variant: 'default' as const,
            };
            return (
              <Card key={purchase.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {purchase.product?.name ?? 'Produto Digital'}
                        </h3>
                        <Badge variant={statusInfo.variant} className="shrink-0 text-xs">
                          {statusInfo.label}
                        </Badge>
                      </div>
                      {purchase.product?.type && (
                        <p className="text-sm text-muted-foreground capitalize mb-2">
                          {purchase.product.type}
                        </p>
                      )}
                      {purchase.product?.files && purchase.product.files.length > 0 && (
                        <div className="space-y-1 mt-3">
                          {purchase.product.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between text-sm border rounded-md px-3 py-2 bg-muted/30"
                            >
                              <span className="truncate">{file.name}</span>
                              <div className="flex items-center gap-2 ml-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatFileSize(file.fileSize)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {purchase.downloadCount} download{purchase.downloadCount !== 1 ? 's' : ''}{' '}
                        realizados
                      </p>
                    </div>
                    {purchase.status === 'active' && (
                      <Button size="sm" variant="outline" className="shrink-0" disabled>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
