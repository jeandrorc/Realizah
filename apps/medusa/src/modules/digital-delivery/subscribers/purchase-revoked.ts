/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function purchaseRevokedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Purchase revoked:', event.data);

  // TODO: Send revocation notification to customer
  // TODO: Update analytics
}

export const config: SubscriberConfig = {
  event: 'digital_purchase.revoked',
};
