import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const downloadLogService = req.scope.resolve('downloadLogService');
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const purchase = await digitalPurchaseService.retrievePurchase(id);

  if (purchase.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const downloads = await downloadLogService.getLogsByPurchase(id);

  res.json({ downloads });
}
