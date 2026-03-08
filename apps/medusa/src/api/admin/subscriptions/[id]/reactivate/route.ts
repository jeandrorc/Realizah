// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const { id } = req.params;

  const subscription = await subscriptionService.reactivateSubscription(id);

  return res.json({ subscription });
}
