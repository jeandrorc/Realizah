import { model } from '@medusajs/framework/utils';

const Subscription = model.define('subscription', {
  id: model.id().primaryKey(),
  customerId: model.text().searchable(),
  planId: model.text(),
  status: model.enum(['trialing', 'active', 'past_due', 'canceled', 'unpaid']),
  currentPeriodStart: model.dateTime(),
  currentPeriodEnd: model.dateTime().searchable(),
  cancelAt: model.dateTime().nullable(),
  canceledAt: model.dateTime().nullable(),
  trialStart: model.dateTime().nullable(),
  trialEnd: model.dateTime().nullable(),
  paymentMethodId: model.text().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
Subscription.belongsTo(() => require('./subscription-plan').default, {
  mappedBy: 'planId',
});

export default Subscription;
