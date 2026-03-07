import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateFeatureInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');

  const { category, required_tier, is_active } = req.query;

  const features = await featureService.listFeatures({
    category: category as string,
    requiredTier: required_tier as string,
    isActive: is_active === 'true',
  });

  return res.json({ features });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');

  const feature = await featureService.createFeature(req.body as CreateFeatureInput);

  return res.status(201).json({ feature });
}
