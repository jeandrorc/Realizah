// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const downloadManagerService = req.scope.resolve('downloadManagerService');
  const digitalPurchaseService = req.scope.resolve('digitalPurchaseService');

  const { id, fileId } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const purchase = await digitalPurchaseService.retrievePurchase(id);

  if (purchase.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ipAddress =
    (req.headers['x-forwarded-for'] as string) ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown';

  const userAgent = req.headers['user-agent'] || 'unknown';

  const downloadUrl = await downloadManagerService.generateDownloadUrl({
    purchaseId: id,
    fileId,
    ipAddress,
    userAgent,
  });

  res.json(downloadUrl);
}
