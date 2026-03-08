import { model } from '@medusajs/framework/utils';

const Feature = model.define('feature', {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  category: model.text(),
  requiredTier: model.enum(['free', 'pro', 'premium']),
  isActive: model.boolean().default(true),
  metadata: model.json().nullable(),
});

export default Feature;
