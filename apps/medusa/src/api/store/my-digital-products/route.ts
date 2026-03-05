import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');
  const digitalProductService = req.scope.resolve('digitalProductService');

  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const purchases = await digitalPurchaseService.getActivePurchases(customerId);

  const purchasesWithProducts = await Promise.all(
    purchases.map(async (purchase) => {
      const product = await digitalProductService.retrieveProduct(purchase.digitalProductId);
      return {
        ...purchase,
        product,
      };
    }),
  );

  res.json({ purchases: purchasesWithProducts });
}
