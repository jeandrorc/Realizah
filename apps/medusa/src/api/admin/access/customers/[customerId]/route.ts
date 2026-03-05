import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const accessControlService = req.scope.resolve('accessControlService');
  const { customerId } = req.params;

  const access = await accessControlService.getCustomerAccess(customerId);
  const features = await accessControlService.calculateAvailableFeatures(
    customerId,
    access.currentTier,
  );

  return res.json({ access, features });
}
