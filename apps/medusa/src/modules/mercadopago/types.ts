export type MercadoPagoPaymentMethodType = 'pix' | 'credit_card' | 'boleto';

export interface MercadoPagoProviderOptions {
  accessToken: string;
  webhookSecret?: string;
  sandbox?: boolean;
}

export interface MercadoPagoPaymentData {
  mpPaymentId?: string;
  mpPreferenceId?: string;
  paymentMethodType?: MercadoPagoPaymentMethodType;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  externalReference?: string;
  status?: string;
  captured?: boolean;
  refunded?: boolean;
}

export interface MercadoPagoWebhookPayload {
  id: string;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}
