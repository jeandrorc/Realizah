import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionInvoiceService = req.scope.resolve('subscriptionInvoiceService');
  const subscriptionService = req.scope.resolve('subscriptionService');
  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const subscription = await subscriptionService.retrieveSubscription(id);

  if (subscription.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const invoices = await subscriptionInvoiceService.getSubscriptionInvoices(id);

  return res.json({ invoices });
}
