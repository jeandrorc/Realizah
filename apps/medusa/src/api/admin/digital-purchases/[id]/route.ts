import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');
  const downloadLogService = req.scope.resolve('downloadLogService');

  const { id } = req.params;

  const purchase = await digitalPurchaseService.retrievePurchase(id);
  const downloads = await downloadLogService.getLogsByPurchase(id);

  res.json({ purchase, downloads });
}
