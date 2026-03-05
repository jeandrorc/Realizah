import { model } from '@medusajs/framework/utils';

const DigitalFile = model.define('digital_file', {
  id: model.id().primaryKey(),
  digitalProductId: model.text().searchable(),
  name: model.text(),
  description: model.text().nullable(),
  storageKey: model.text().unique(),
  fileSize: model.bigNumber(),
  mimeType: model.text(),
  checksum: model.text(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
DigitalFile.belongsTo(() => require('./digital-product').default, {
  mappedBy: 'digitalProductId',
});

export default DigitalFile;
