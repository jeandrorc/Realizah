// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');
  const { id } = req.params;

  const feature = await featureService.retrieveFeature(id);

  if (!feature.isActive) {
    return res.status(404).json({ error: 'Feature not found or inactive' });
  }

  return res.json({ feature });
}
