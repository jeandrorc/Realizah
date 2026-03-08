// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');

  const { customer_id, status } = req.query;

  const subscriptions = await subscriptionService.listSubscriptions({
    customerId: customer_id as string,
    status: status as string,
  });

  return res.json({ subscriptions });
}
