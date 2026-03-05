/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function purchaseExpiredHandler({ event }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Purchase expired:', event.data);

  // TODO: Send expiration notification to customer
  // TODO: Offer renewal option
}

export const config: SubscriberConfig = {
  event: 'digital_purchase.expired',
};
