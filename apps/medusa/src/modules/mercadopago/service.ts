// @ts-nocheck
import { AbstractPaymentProvider, BigNumber } from '@medusajs/framework/utils';
import type {
  CreatePaymentProviderSession,
  UpdatePaymentProviderSession,
  ProviderWebhookPayload,
  WebhookActionResult,
  PaymentSessionStatus,
  PaymentProviderError,
  PaymentProviderSessionResponse,
} from '@medusajs/types';
import { MercadoPagoConfig, Payment, Preference, PreApproval } from 'mercadopago';
import type {
  MercadoPagoProviderOptions,
  MercadoPagoPaymentData,
  MercadoPagoWebhookPayload,
} from './types';
import {
  mapMercadoPagoStatusToMedusa,
  generateExternalReference,
  parsePriceToMercadoPago,
} from './utils';

type InjectedDependencies = {
  logger: { info: (msg: string) => void; error: (msg: string, err?: unknown) => void };
};

export default class MercadoPagoProviderService extends AbstractPaymentProvider<MercadoPagoProviderOptions> {
  static identifier = 'mercadopago';

  private mpConfig: MercadoPagoConfig;
  private logger_: InjectedDependencies['logger'];

  constructor(container: InjectedDependencies, options: MercadoPagoProviderOptions) {
    // @ts-expect-error - Medusa pattern requires passing arguments to super
    super(container, options);

    this.mpConfig = new MercadoPagoConfig({
      accessToken: options.accessToken,
      options: { timeout: 5000 },
    });

    this.logger_ = container.logger;
  }

  static validateOptions(options: Record<string, unknown>): void | never {
    if (!options.accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is required in the provider's options.");
    }
  }

  async initiatePayment(
    context: CreatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code, context: paymentContext } = context;
    const sessionId = (paymentContext?.session_id as string) ?? 'unknown';
    const description = (paymentContext?.payment_description as string) ?? 'Realizah - Pagamento';
    const paymentMethodType = (paymentContext?.payment_method_type as string) ?? 'credit_card';

    try {
      const preference = new Preference(this.mpConfig);
      const externalReference = generateExternalReference(sessionId);

      const preferenceData = await preference.create({
        body: {
          items: [
            {
              id: sessionId,
              title: description,
              quantity: 1,
              unit_price: parsePriceToMercadoPago(amount),
              currency_id: currency_code?.toUpperCase() ?? 'BRL',
            },
          ],
          external_reference: externalReference,
          payment_methods: this.getPaymentMethodsConfig(paymentMethodType),
          notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
        },
      });

      return {
        id: preferenceData.id ?? sessionId,
        data: {
          mpPreferenceId: preferenceData.id,
          externalReference,
          paymentMethodType,
          status: 'pending',
          initPoint: preferenceData.init_point,
          sandboxInitPoint: preferenceData.sandbox_init_point,
        } as MercadoPagoPaymentData & Record<string, unknown>,
      };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to initiate payment', error);
      return {
        error: 'Failed to initiate Mercado Pago payment',
        code: 'MP_INITIATE_ERROR',
        detail: error,
      };
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<
    | PaymentProviderError
    | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse['data'] }
  > {
    void context;
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return { status: 'pending', data: paymentSessionData };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      const status = mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');

      return {
        status,
        data: {
          ...data,
          status: mpPayment.status,
        },
      };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to authorize payment', error);
      return {
        error: 'Failed to authorize Mercado Pago payment',
        code: 'MP_AUTHORIZE_ERROR',
        detail: error,
      };
    }
  }

  async capturePayment(
    paymentData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    const data = paymentData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return { ...data, captured: false };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });

      if (mpPayment.status === 'approved') {
        return { ...data, captured: true };
      }

      return { ...data, captured: false, status: mpPayment.status };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to capture payment', error);
      return {
        error: 'Failed to capture Mercado Pago payment',
        code: 'MP_CAPTURE_ERROR',
        detail: error,
      };
    }
  }

  async cancelPayment(
    paymentData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    const data = paymentData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return data;
    }

    try {
      const payment = new Payment(this.mpConfig);
      await payment.cancel({ id: data.mpPaymentId });
      return { ...data, status: 'cancelled' };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to cancel payment', error);
      return {
        error: 'Failed to cancel Mercado Pago payment',
        code: 'MP_CANCEL_ERROR',
        detail: error,
      };
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    return this.cancelPayment(paymentSessionData);
  }

  async refundPayment(
    paymentData: Record<string, unknown>,
    refundAmount: number,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    const data = paymentData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return {
        error: 'No payment ID found for refund',
        code: 'MP_NO_PAYMENT_ID',
        detail: 'mpPaymentId is required for refund',
      };
    }

    try {
      const paymentRefundClient = new Payment(this.mpConfig);
      await paymentRefundClient.refund({
        payment_id: data.mpPaymentId,
        body: { amount: parsePriceToMercadoPago(refundAmount) },
      });
      return { ...data, refunded: true };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to refund payment', error);
      return {
        error: 'Failed to refund Mercado Pago payment',
        code: 'MP_REFUND_ERROR',
        detail: error,
      };
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return data;
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      return {
        ...data,
        status: mpPayment.status,
        mpStatus: mpPayment.status_detail,
        transactionAmount: mpPayment.transaction_amount,
      };
    } catch (error) {
      this.logger_.error('[MercadoPago] Failed to retrieve payment', error);
      return {
        error: 'Failed to retrieve Mercado Pago payment',
        code: 'MP_RETRIEVE_ERROR',
        detail: error,
      };
    }
  }

  async updatePayment(
    context: UpdatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return this.initiatePayment(context);
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentSessionStatus> {
    const data = paymentSessionData as MercadoPagoPaymentData;

    if (!data.mpPaymentId) {
      return 'pending';
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: data.mpPaymentId });
      return mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');
    } catch {
      return 'error';
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload['payload'],
  ): Promise<WebhookActionResult> {
    const webhookData = payload.data as MercadoPagoWebhookPayload;

    if (webhookData.type !== 'payment') {
      return { action: 'not_supported' };
    }

    try {
      const payment = new Payment(this.mpConfig);
      const mpPayment = await payment.get({ id: webhookData.data.id });
      const status = mapMercadoPagoStatusToMedusa(mpPayment.status ?? 'pending');
      const amount = new BigNumber(Math.round((mpPayment.transaction_amount ?? 0) * 100));
      const sessionId = mpPayment.external_reference ?? '';

      if (status === 'captured') {
        return { action: 'captured', data: { session_id: sessionId, amount } };
      }

      if (status === 'authorized') {
        return { action: 'authorized', data: { session_id: sessionId, amount } };
      }

      if (status === 'canceled' || status === 'error') {
        return { action: 'failed', data: { session_id: sessionId, amount } };
      }

      return { action: 'not_supported' };
    } catch (error) {
      this.logger_.error('[MercadoPago] Webhook processing failed', error);
      return { action: 'failed', data: { session_id: '', amount: new BigNumber(0) } };
    }
  }

  createPreApproval(options: {
    reason: string;
    payerEmail: string;
    amount: number;
    frequency: number;
    frequencyType: 'months' | 'years';
    currency: string;
    backUrl: string;
    externalReference: string;
  }) {
    const preApproval = new PreApproval(this.mpConfig);
    return preApproval.create({
      body: {
        reason: options.reason,
        payer_email: options.payerEmail,
        auto_recurring: {
          frequency: options.frequency,
          frequency_type: options.frequencyType,
          transaction_amount: parsePriceToMercadoPago(options.amount),
          currency_id: options.currency,
        },
        back_url: options.backUrl,
        external_reference: options.externalReference,
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      },
    });
  }

  createPixPayment(options: {
    amount: number;
    description: string;
    email: string;
    firstName: string;
    lastName: string;
    cpf: string;
    externalReference: string;
  }) {
    const payment = new Payment(this.mpConfig);
    return payment.create({
      body: {
        transaction_amount: parsePriceToMercadoPago(options.amount),
        description: options.description,
        payment_method_id: 'pix',
        payer: {
          email: options.email,
          first_name: options.firstName,
          last_name: options.lastName,
          identification: {
            type: 'CPF',
            number: options.cpf,
          },
        },
        external_reference: options.externalReference,
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      },
    });
  }

  private getPaymentMethodsConfig(paymentMethodType: string) {
    if (paymentMethodType === 'pix') {
      return {
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }],
        installments: 1,
      };
    }

    if (paymentMethodType === 'boleto') {
      return {
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }],
        installments: 1,
      };
    }

    return {
      excluded_payment_types: [{ id: 'ticket' }],
      installments: 12,
    };
  }
}
