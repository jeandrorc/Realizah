import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionPlanService = req.scope.resolve('subscriptionPlanService');

  const plans = await subscriptionPlanService.listActivePlans();

  return res.json({ plans });
}
