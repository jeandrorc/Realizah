import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionService = req.scope.resolve('subscriptionService');
  const { id } = req.params;

  const subscription = await subscriptionService.retrieveSubscription(id);

  return res.json({ subscription });
}
