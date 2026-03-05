/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberConfig } from '@medusajs/framework';

export default async function subscriptionPaymentFailedHandler({
  event,
  container,
}: {
  event: { data: { subscription: any } };
  container: any;
}) {
  const logger = container.resolve('logger');
  const accessControlService = container.resolve('accessControlService');

  try {
    const subscription = event.data.subscription;

    // Sync access but maintain tier temporarily (grace period)
    await accessControlService.syncCustomerAccess(subscription.customerId);

    logger.warn(
      `[Access Control] Payment failed for customer ${subscription.customerId}, maintaining access temporarily`,
    );

    // TODO: Implement grace period logic
    // After X days of failed payments, downgrade to free
  } catch (error) {
    logger.error(
      `[Access Control] Failed to handle payment failure: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export const config: SubscriberConfig = {
  event: 'subscription.payment_failed',
};
