// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');
  const digitalProductService = req.scope.resolve('digitalProductService');
  const digitalFileService = req.scope.resolve('digitalFileService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const purchase = await digitalPurchaseService.retrievePurchase(id);

  if (purchase.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const product = await digitalProductService.retrieveProduct(purchase.digitalProductId);
  const files = await digitalFileService.getFilesByProduct(product.id);

  res.json({ purchase, product, files });
}
