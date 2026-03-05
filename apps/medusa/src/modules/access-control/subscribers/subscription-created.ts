/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberConfig } from '@medusajs/framework';

export default async function subscriptionCreatedHandler({
  event,
  container,
}: {
  event: { data: { subscription: any } };
  container: any;
}) {
  const logger = container.resolve('logger');
  const accessControlService = container.resolve('accessControlService');
  const subscriptionPlanService = container.resolve('subscriptionPlanService');

  try {
    const subscription = event.data.subscription;
    const plan = await subscriptionPlanService.retrievePlan(subscription.planId);

    await accessControlService.updateCustomerTier(
      subscription.customerId,
      plan.tier,
      subscription.id,
      subscription.status,
    );

    logger.info(
      `[Access Control] Updated tier to ${plan.tier} for customer ${subscription.customerId}`,
    );
  } catch (error) {
    logger.error(
      `[Access Control] Failed to update tier on subscription created: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export const config: SubscriberConfig = {
  event: 'subscription.created',
};
