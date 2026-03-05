import type { SubscriberConfig } from '@medusajs/framework';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function paymentFailedHandler({
  event,
  container,
}: {
  event: { data: { subscription: any; invoice: any; error: any } };
  container: any;
}) {
  const logger = container.resolve('logger');
  const subscriptionService = container.resolve('subscriptionService');

  logger.error(
    `[Subscription] Payment failed: ${event.data.subscription.id} - ${event.data.error.message}`,
  );

  await subscriptionService.updateSubscriptions(event.data.subscription.id, {
    status: 'past_due',
  });

  // TODO: Enviar email de falha de pagamento
  // TODO: Agendar retry
}

export const config: SubscriberConfig = {
  event: 'subscription.payment_failed',
};
