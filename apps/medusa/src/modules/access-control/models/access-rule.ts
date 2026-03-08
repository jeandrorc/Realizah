import { model } from '@medusajs/framework/utils';

const AccessRule = model.define('access_rule', {
  id: model.id().primaryKey(),
  featureId: model.text(),
  customerId: model.text().nullable(),
  tier: model.enum(['free', 'pro', 'premium']).nullable(),
  action: model.enum(['allow', 'deny']),
  priority: model.number().default(0),
  expiresAt: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

export default AccessRule;
