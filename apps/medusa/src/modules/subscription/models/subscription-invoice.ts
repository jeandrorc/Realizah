import { model } from '@medusajs/framework/utils';

const SubscriptionInvoice = model.define('subscription_invoice', {
  id: model.id().primaryKey(),
  subscriptionId: model.text().searchable(),
  customerId: model.text().searchable(),
  amount: model.number(),
  currency: model.text().default('BRL'),
  status: model.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  periodStart: model.dateTime(),
  periodEnd: model.dateTime(),
  dueDate: model.dateTime(),
  paidAt: model.dateTime().nullable(),
  paymentIntentId: model.text().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
SubscriptionInvoice.belongsTo(() => require('./subscription').default, {
  mappedBy: 'subscriptionId',
});

export default SubscriptionInvoice;
