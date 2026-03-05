/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function orderRefundedHandler({ event, container }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Order refunded:', event.data);

  const purchaseManagerService = container.resolve('purchaseManagerService');

  const { id: orderId } = event.data;

  // Revoke purchases for this order
  const revoked = await purchaseManagerService.revokePurchases(orderId, 'Order refunded');

  console.log(`[Digital Delivery] Revoked ${revoked.length} purchases for order ${orderId}`);

  // TODO: Send notification to customer
}

export const config: SubscriberConfig = {
  event: 'order.refunded',
};
