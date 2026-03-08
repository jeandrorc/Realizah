// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionInvoiceService = req.scope.resolve('subscriptionInvoiceService');
  const { id } = req.params;

  const invoice = await subscriptionInvoiceService.retrieveInvoice(id);

  return res.json({ invoice });
}
