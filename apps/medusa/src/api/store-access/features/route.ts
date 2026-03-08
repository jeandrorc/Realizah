// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');

  const features = await featureService.listActiveFeatures();

  return res.json({ features });
}
