/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function purchaseLimitReachedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Purchase limit reached:', event.data);

  // TODO: Send limit notification to customer
  // TODO: Offer additional downloads for purchase
}

export const config: SubscriberConfig = {
  event: 'digital_purchase.limit_reached',
};
