import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const accessControlService = req.scope.resolve('accessControlService');
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const access = await accessControlService.getCustomerAccess(customerId);
  const features = await accessControlService.calculateAvailableFeatures(
    customerId,
    access.currentTier,
  );

  return res.json({
    currentTier: access.currentTier,
    features: features.filter((f) => f.hasAccess),
    unavailableFeatures: features.filter((f) => !f.hasAccess),
  });
}
