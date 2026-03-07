export function mapMercadoPagoStatusToMedusa(
  mpStatus: string,
): 'authorized' | 'captured' | 'pending' | 'requires_more' | 'error' | 'canceled' {
  const statusMap: Record<
    string,
    'authorized' | 'captured' | 'pending' | 'requires_more' | 'error' | 'canceled'
  > = {
    approved: 'captured',
    authorized: 'authorized',
    in_process: 'pending',
    in_mediation: 'requires_more',
    rejected: 'error',
    cancelled: 'canceled',
    refunded: 'canceled',
    charged_back: 'canceled',
    pending: 'pending',
  };
  return statusMap[mpStatus] ?? 'error';
}

export function generateExternalReference(cartId: string): string {
  return `realizah_${cartId}_${Date.now()}`;
}

export function parsePriceToMercadoPago(amountInCents: number): number {
  return amountInCents / 100;
}
