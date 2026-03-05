import type { SubscriberConfig } from '@medusajs/framework';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function subscriptionRenewedHandler({
  event,
  container,
}: {
  event: { data: { subscription: any; invoice: any } };
  container: any;
}) {
  const logger = container.resolve('logger');

  logger.info(
    `[Subscription] Renewed: ${event.data.subscription.id} - Invoice: ${event.data.invoice.id}`,
  );

  // TODO: Enviar email com invoice
  // TODO: Processar pagamento via Mercado Pago
}

export const config: SubscriberConfig = {
  event: 'subscription.renewed',
};
