import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateSubscriptionPlanInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');
  const { id } = req.params;

  const plan = await subscriptionPlanService.retrievePlan(id);

  return res.json({ plan });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');
  const { id } = req.params;

  const plan = await subscriptionPlanService.updatePlan(
    id,
    req.body as UpdateSubscriptionPlanInput,
  );

  return res.json({ plan });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');
  const { id } = req.params;

  await subscriptionPlanService.deletePlan(id);

  return res.status(204).send();
}
