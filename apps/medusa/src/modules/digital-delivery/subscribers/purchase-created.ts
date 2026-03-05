/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function purchaseCreatedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Purchase created:', event.data);

  // TODO: Send download email to customer
  // TODO: Update analytics
}

export const config: SubscriberConfig = {
  event: 'digital_purchase.created',
};
