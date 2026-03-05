import type { SubscriberConfig } from '@medusajs/framework';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function subscriptionCanceledHandler({
  event,
  container,
}: {
  event: { data: { subscription: any } };
  container: any;
}) {
  const logger = container.resolve('logger');

  logger.info(
    `[Subscription] Canceled: ${event.data.subscription.id} for customer ${event.data.subscription.customerId}`,
  );

  // TODO: Enviar email de confirmação de cancelamento
  // TODO: Notificar Access Control Module
}

export const config: SubscriberConfig = {
  event: 'subscription.canceled',
};
