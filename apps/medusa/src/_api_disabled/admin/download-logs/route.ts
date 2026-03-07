import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const downloadLogService = req.scope.resolve('downloadLogService');

  const { digitalPurchaseId, digitalFileId, customerId } = req.query;

  const logs = await downloadLogService.listLogs({
    digitalPurchaseId,
    digitalFileId,
    customerId,
  });

  res.json({ logs });
}
