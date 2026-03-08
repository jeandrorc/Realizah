// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import type { IPaymentModuleService } from '@medusajs/types';
import type { MercadoPagoWebhookPayload } from '../../../../modules/mercadopago/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const paymentService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);
  const logger = req.scope.resolve('logger');

  const webhookPayload = req.body as MercadoPagoWebhookPayload;

  logger.info(
    `[MercadoPago Webhook] type=${webhookPayload.type} action=${webhookPayload.action} id=${webhookPayload.data?.id}`,
  );

  try {
    await paymentService.processEvent({
      provider: 'mercadopago',
      payload: {
        data: webhookPayload,
        rawData: JSON.stringify(req.body),
        headers: req.headers as Record<string, string>,
      },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('[MercadoPago Webhook] processing failed', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
