import { model } from '@medusajs/framework/utils';

const DownloadLog = model.define('download_log', {
  id: model.id().primaryKey(),
  digitalPurchaseId: model.text(),
  digitalFileId: model.text(),
  customerId: model.text(),
  ipAddress: model.text(),
  userAgent: model.text().nullable(),
  downloadedAt: model.dateTime(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(DownloadLog as any).belongsTo(() => require('./digital-purchase').default, {
  mappedBy: 'digitalPurchaseId',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(DownloadLog as any).belongsTo(() => require('./digital-file').default, {
  mappedBy: 'digitalFileId',
});

export default DownloadLog;
