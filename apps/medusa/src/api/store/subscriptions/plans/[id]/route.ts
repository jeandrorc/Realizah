import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');
  const { id } = req.params;

  const plan = await subscriptionPlanService.retrievePlan(id);

  if (!plan.isActive) {
    return res.status(404).json({ error: 'Plan not found or inactive' });
  }

  return res.json({ plan });
}
