/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberConfig } from '@medusajs/framework';

export default async function subscriptionCanceledHandler({
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

    // Downgrade to free tier
    await accessControlService.updateCustomerTier(
      subscription.customerId,
      'free',
      undefined,
      'canceled',
    );

    logger.info(`[Access Control] Downgraded to free tier for customer ${subscription.customerId}`);
  } catch (error) {
    logger.error(
      `[Access Control] Failed to downgrade tier on subscription canceled: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export const config: SubscriberConfig = {
  event: 'subscription.canceled',
};
