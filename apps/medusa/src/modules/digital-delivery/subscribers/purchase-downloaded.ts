/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function purchaseDownloadedHandler({ event, container }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Purchase downloaded:', event.data);

  const downloadLogService = container.resolve('downloadLogService');

  const { purchaseId } = event.data;

  // Check for suspicious activity
  const suspicious = await downloadLogService.detectSuspiciousActivity(purchaseId);

  if (suspicious.isSuspicious) {
    console.warn(
      `[Digital Delivery] Suspicious activity detected for purchase ${purchaseId}:`,
      suspicious.reasons,
    );
    // TODO: Alert admin
    // TODO: Potentially auto-revoke
  }

  // TODO: Update analytics
}

export const config: SubscriberConfig = {
  event: 'digital_purchase.downloaded',
};
