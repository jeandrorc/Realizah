import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateSubscriptionPlanInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');

  const plans = await subscriptionPlanService.listPlans();

  return res.json({ plans });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');

  const plan = await subscriptionPlanService.createPlan(req.body as CreateSubscriptionPlanInput);

  return res.status(201).json({ plan });
}
