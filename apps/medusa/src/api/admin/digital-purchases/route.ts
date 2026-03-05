import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');

  const { customerId, digitalProductId, orderId, status } = req.query;

  const purchases = await digitalPurchaseService.listPurchases({
    customerId,
    digitalProductId,
    orderId,
    status,
  });

  res.json({ purchases });
}
