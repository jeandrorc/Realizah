import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CancelSubscriptionInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const { id } = req.params;

  const subscription = await subscriptionService.cancelSubscription(
    id,
    req.body as CancelSubscriptionInput,
  );

  return res.json({ subscription });
}
