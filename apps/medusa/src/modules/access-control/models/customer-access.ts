import { model } from '@medusajs/framework/utils';

const CustomerAccess = model.define('customer_access', {
  customerId: model.text().primaryKey(),
  currentTier: model.enum(['free', 'pro', 'premium']),
  subscriptionId: model.text().nullable(),
  subscriptionStatus: model.text().nullable(),
  features: model.json(),
  lastSyncedAt: model.dateTime(),
  expiresAt: model.dateTime().nullable(),
});

export default CustomerAccess;
