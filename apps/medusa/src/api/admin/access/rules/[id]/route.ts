// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateAccessRuleInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const accessRuleService = req.scope.resolve('accessRuleService');
  const { id } = req.params;

  const rule = await accessRuleService.retrieveRule(id);

  return res.json({ rule });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const accessRuleService = req.scope.resolve('accessRuleService');
  const { id } = req.params;

  const rule = await accessRuleService.updateRule(id, req.body as UpdateAccessRuleInput);

  return res.json({ rule });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const accessRuleService = req.scope.resolve('accessRuleService');
  const { id } = req.params;

  await accessRuleService.deleteRule(id);

  return res.status(204).send();
}
