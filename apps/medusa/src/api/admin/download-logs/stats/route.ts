// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const downloadLogService = req.scope.resolve('downloadLogService');

  const stats = await downloadLogService.getDownloadStats();

  res.json({ stats });
}
