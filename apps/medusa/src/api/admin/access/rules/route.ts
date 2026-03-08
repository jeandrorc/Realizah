// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateAccessRuleInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const accessRuleService = req.scope.resolve('accessRuleService');

  const { feature_id, customer_id, tier } = req.query;

  const rules = await accessRuleService.listRules({
    featureId: feature_id as string,
    customerId: customer_id as string,
    tier: tier as string,
  });

  return res.json({ rules });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const accessRuleService = req.scope.resolve('accessRuleService');

  const rule = await accessRuleService.createRule(req.body as CreateAccessRuleInput);

  return res.status(201).json({ rule });
}
