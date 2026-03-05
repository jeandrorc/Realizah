import { model } from '@medusajs/framework/utils';

const SubscriptionPlan = model.define('subscription_plan', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  description: model.text().nullable(),
  price: model.number(),
  currency: model.text().default('BRL'),
  interval: model.enum(['monthly', 'yearly']),
  intervalCount: model.number().default(1),
  trialDays: model.number().nullable(),
  features: model.json(),
  tier: model.enum(['free', 'pro', 'premium']),
  isActive: model.boolean().default(true),
  metadata: model.json().nullable(),
});

export default SubscriptionPlan;
