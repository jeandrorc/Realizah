import type { SubscriberConfig } from '@medusajs/framework';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function subscriptionCreatedHandler({
  event,
  container,
}: {
  event: { data: { subscription: any } };
  container: any;
}) {
  const logger = container.resolve('logger');

  logger.info(
    `[Subscription] Created: ${event.data.subscription.id} for customer ${event.data.subscription.customerId}`,
  );

  // TODO: Enviar email de boas-vindas
  // TODO: Notificar Access Control Module
}

export const config: SubscriberConfig = {
  event: 'subscription.created',
};
