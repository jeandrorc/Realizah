import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { GrantAccessInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const accessControlService = req.scope.resolve('accessControlService');
  const { customerId } = req.params;

  await accessControlService.grantAccess(customerId, req.body as GrantAccessInput);

  const access = await accessControlService.getCustomerAccess(customerId);

  return res.json({ access, message: 'Access granted successfully' });
}
