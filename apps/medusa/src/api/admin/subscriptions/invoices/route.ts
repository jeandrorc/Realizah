// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionInvoiceService = req.scope.resolve('subscriptionInvoiceService');

  const { subscription_id, customer_id, status } = req.query;

  const invoices = await subscriptionInvoiceService.listInvoices({
    subscriptionId: subscription_id as string,
    customerId: customer_id as string,
    status: status as string,
  });

  return res.json({ invoices });
}
