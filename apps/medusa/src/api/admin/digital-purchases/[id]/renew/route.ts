// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');

  const { id } = req.params;
  const { expirationDays } = req.body;

  if (!expirationDays || expirationDays <= 0) {
    return res.status(400).json({
      error: 'expirationDays must be a positive number',
    });
  }

  const purchase = await digitalPurchaseService.renewPurchase(id, expirationDays);

  res.json({ purchase });
}
