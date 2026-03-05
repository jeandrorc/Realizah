import { model } from '@medusajs/framework/utils';

const AccessRule = model.define('access_rule', {
  id: model.id().primaryKey(),
  featureId: model.text().searchable(),
  customerId: model.text().nullable().searchable(),
  tier: model.enum(['free', 'pro', 'premium']).nullable(),
  action: model.enum(['allow', 'deny']),
  priority: model.number().default(0),
  expiresAt: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
AccessRule.belongsTo(() => require('./feature').default, {
  mappedBy: 'featureId',
});

export default AccessRule;
