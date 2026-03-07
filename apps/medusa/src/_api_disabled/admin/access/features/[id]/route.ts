import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateFeatureInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');
  const { id } = req.params;

  const feature = await featureService.retrieveFeature(id);

  return res.json({ feature });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');
  const { id } = req.params;

  const feature = await featureService.updateFeature(id, req.body as UpdateFeatureInput);

  return res.json({ feature });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const featureService = req.scope.resolve('featureService');
  const { id } = req.params;

  await featureService.deleteFeature(id);

  return res.status(204).send();
}
