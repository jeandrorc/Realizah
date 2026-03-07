import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import MercadoPagoProviderService from '../../../../modules/mercadopago/service';
import { generateExternalReference } from '../../../../modules/mercadopago/utils';

interface PixPaymentRequest {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  cpf: string;
  sessionId: string;
  description?: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve('logger');
  const body = req.body as PixPaymentRequest;

  if (!body.amount || !body.email || !body.cpf || !body.sessionId) {
    return res.status(400).json({ error: 'amount, email, cpf and sessionId are required' });
  }

  const mpService = new MercadoPagoProviderService(
    { logger },
    {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
      webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
      sandbox: process.env.MERCADOPAGO_SANDBOX === 'true',
    },
  );

  try {
    const pixPayment = await mpService.createPixPayment({
      amount: body.amount,
      description: body.description ?? 'Realizah - Pagamento PIX',
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      cpf: body.cpf,
      externalReference: generateExternalReference(body.sessionId),
    });

    return res.status(200).json({
      paymentId: pixPayment.id,
      status: pixPayment.status,
      qrCode: pixPayment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: pixPayment.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: pixPayment.point_of_interaction?.transaction_data?.ticket_url,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    logger.error('[PIX] Failed to create payment', error);
    return res.status(500).json({ error: 'Failed to create PIX payment' });
  }
}
