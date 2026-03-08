// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function orderPaymentCapturedHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Order payment captured:', event.data);

  const purchaseManagerService = container.resolve('purchaseManagerService');

  const { id: orderId } = event.data;

  // Activate purchases for this order
  const activated = await purchaseManagerService.activatePurchases(orderId);

  console.log(`[Digital Delivery] Activated ${activated.length} purchases for order ${orderId}`);

  // TODO: Send download email to customer
  // TODO: Emit digital_purchase.created events
}

export const config: SubscriberConfig = {
  event: 'order.payment_captured',
};
