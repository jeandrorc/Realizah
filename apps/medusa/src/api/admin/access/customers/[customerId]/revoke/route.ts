// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { RevokeAccessInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const accessControlService = req.scope.resolve('accessControlService');
  const { customerId } = req.params;

  await accessControlService.revokeAccess(customerId, req.body as RevokeAccessInput);

  const access = await accessControlService.getCustomerAccess(customerId);

  return res.json({ access, message: 'Access revoked successfully' });
}
