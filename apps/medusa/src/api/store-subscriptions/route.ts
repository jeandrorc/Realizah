// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateSubscriptionInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const subscriptions = await subscriptionService.getCustomerSubscriptions(customerId);

  return res.json({ subscriptions });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const input: CreateSubscriptionInput = {
    ...req.body,
    customerId,
  };

  const subscription = await subscriptionService.createSubscription(input);

  return res.status(201).json({ subscription });
}
