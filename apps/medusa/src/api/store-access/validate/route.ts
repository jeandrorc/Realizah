// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { ValidateAccessInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const accessControlService = req.scope.resolve('accessControlService');
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { featureId } = req.body as ValidateAccessInput;

  const hasAccess = await accessControlService.hasAccess(customerId, featureId);

  return res.json({ featureId, hasAccess });
}
