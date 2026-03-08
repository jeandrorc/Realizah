// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import MercadoPagoProviderService from '../../../../modules/mercadopago/service';

interface SubscriptionPaymentRequest {
  planId: string;
  customerEmail: string;
  backUrl: string;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve('logger');
  const subscriptionService = req.scope.resolve('subscriptionService');
  const body = req.body as SubscriptionPaymentRequest;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!body.planId || !body.customerEmail || !body.backUrl) {
    return res.status(400).json({ error: 'planId, customerEmail and backUrl are required' });
  }

  try {
    const plan = await subscriptionService.retrieveSubscriptionPlan(body.planId);

    const mpService = new MercadoPagoProviderService(
      { logger },
      {
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
        webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
        sandbox: process.env.MERCADOPAGO_SANDBOX === 'true',
      },
    );

    const preApproval = await mpService.createPreApproval({
      reason: `Realizah - ${plan.name}`,
      payerEmail: body.customerEmail,
      amount: plan.price,
      frequency: plan.intervalCount ?? 1,
      frequencyType: plan.interval === 'yearly' ? 'years' : 'months',
      currency: plan.currency?.toUpperCase() ?? 'BRL',
      backUrl: body.backUrl,
      externalReference: `sub_${customerId}_${body.planId}_${Date.now()}`,
    });

    return res.status(200).json({
      preApprovalId: preApproval.id,
      checkoutUrl: preApproval.init_point,
      status: preApproval.status,
    });
  } catch (error) {
    logger.error('[Subscription Payment] Failed to create preapproval', error);
    return res.status(500).json({ error: 'Failed to create subscription payment' });
  }
}
