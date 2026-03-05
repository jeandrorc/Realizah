/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function orderPlacedHandler({ event, container }: SubscriberArgs<any>) {
  console.log('[Digital Delivery] Order placed:', event.data);

  const purchaseManagerService = container.resolve('purchaseManagerService');

  const { id: orderId, customer_id: customerId, items } = event.data;

  // Create purchases for digital products in this order
  const purchases = await purchaseManagerService.createPurchasesFromOrder(
    orderId,
    customerId,
    items,
  );

  console.log(`[Digital Delivery] Created ${purchases.length} purchases for order ${orderId}`);
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
