import { model } from '@medusajs/framework/utils';

const DownloadLog = model.define('download_log', {
  id: model.id().primaryKey(),
  digitalPurchaseId: model.text().searchable(),
  digitalFileId: model.text().searchable(),
  customerId: model.text().searchable(),
  ipAddress: model.text(),
  userAgent: model.text().nullable(),
  downloadedAt: model.dateTime(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
DownloadLog.belongsTo(() => require('./digital-purchase').default, {
  mappedBy: 'digitalPurchaseId',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
DownloadLog.belongsTo(() => require('./digital-file').default, {
  mappedBy: 'digitalFileId',
});

export default DownloadLog;
