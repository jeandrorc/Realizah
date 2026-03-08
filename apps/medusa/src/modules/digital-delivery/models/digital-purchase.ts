import { model } from '@medusajs/framework/utils';

const DigitalPurchase = model.define('digital_purchase', {
  id: model.id().primaryKey(),
  customerId: model.text(),
  digitalProductId: model.text(),
  orderId: model.text(),
  status: model.enum(['pending', 'active', 'expired', 'revoked']),
  downloadCount: model.number().default(0),
  lastDownloadAt: model.dateTime().nullable(),
  expiresAt: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(DigitalPurchase as any).belongsTo(() => require('./digital-product').default, {
  mappedBy: 'digitalProductId',
});

export default DigitalPurchase;
