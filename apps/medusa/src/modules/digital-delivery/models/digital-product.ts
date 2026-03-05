import { model } from '@medusajs/framework/utils';

const DigitalProduct = model.define('digital_product', {
  id: model.id().primaryKey(),
  productId: model.text().unique().searchable(),
  name: model.text(),
  description: model.text().nullable(),
  type: model.enum(['ebook', 'template', 'software', 'audio', 'video', 'document', 'other']),
  downloadLimit: model.number().nullable(),
  expirationDays: model.number().nullable(),
  fileSize: model.bigNumber().default(0),
  requiredTier: model.enum(['free', 'pro', 'premium']).nullable(),
  metadata: model.json().nullable(),
});

export default DigitalProduct;
