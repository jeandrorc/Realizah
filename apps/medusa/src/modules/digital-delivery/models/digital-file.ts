import { model } from '@medusajs/framework/utils';

const DigitalFile = model.define('digital_file', {
  id: model.id().primaryKey(),
  digitalProductId: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  storageKey: model.text().unique(),
  fileSize: model.bigNumber(),
  mimeType: model.text(),
  checksum: model.text(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(DigitalFile as any).belongsTo(() => require('./digital-product').default, {
  mappedBy: 'digitalProductId',
});

export default DigitalFile;
