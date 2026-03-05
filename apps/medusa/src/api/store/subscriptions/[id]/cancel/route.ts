import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CancelSubscriptionInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingSubscription = await subscriptionService.retrieveSubscription(id);

  if (existingSubscription.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const subscription = await subscriptionService.cancelSubscription(
    id,
    req.body as CancelSubscriptionInput,
  );

  return res.json({ subscription });
}
