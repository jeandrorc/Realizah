// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');

  const { id } = req.params;
  const { reason } = req.body;

  const purchase = await digitalPurchaseService.revokePurchase(id, reason);

  res.json({ purchase });
}
