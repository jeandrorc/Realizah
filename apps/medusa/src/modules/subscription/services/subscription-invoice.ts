import { MedusaService } from '@medusajs/framework/utils';
import type { SubscriptionInvoice as SubscriptionInvoiceType } from '@realizah/types';

interface CreateInvoiceInput {
  subscriptionId: string;
  customerId: string;
  amount: number;
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  metadata?: Record<string, unknown>;
}

class SubscriptionInvoiceService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SubscriptionInvoice: require('../models/subscription-invoice').default,
}) {
  async createInvoice(data: CreateInvoiceInput): Promise<SubscriptionInvoiceType> {
    const invoice = await this.createSubscriptionInvoices({
      ...data,
      status: 'open',
    });
    return invoice as SubscriptionInvoiceType;
  }

  async listInvoices(filters?: {
    subscriptionId?: string;
    customerId?: string;
    status?: string;
  }): Promise<SubscriptionInvoiceType[]> {
    const invoices = await this.listSubscriptionInvoices(filters);
    return invoices as SubscriptionInvoiceType[];
  }

  async retrieveInvoice(invoiceId: string): Promise<SubscriptionInvoiceType> {
    const invoice = await this.retrieveSubscriptionInvoice(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }
    return invoice as SubscriptionInvoiceType;
  }

  async markInvoiceAsPaid(
    invoiceId: string,
    paymentIntentId: string,
  ): Promise<SubscriptionInvoiceType> {
    const invoice = await this.updateSubscriptionInvoices(invoiceId, {
      status: 'paid',
      paidAt: new Date(),
      paymentIntentId,
    });
    return invoice as SubscriptionInvoiceType;
  }

  async markInvoiceAsVoid(invoiceId: string): Promise<SubscriptionInvoiceType> {
    const invoice = await this.updateSubscriptionInvoices(invoiceId, {
      status: 'void',
    });
    return invoice as SubscriptionInvoiceType;
  }

  async getSubscriptionInvoices(subscriptionId: string): Promise<SubscriptionInvoiceType[]> {
    return this.listInvoices({ subscriptionId });
  }

  async getCustomerInvoices(customerId: string): Promise<SubscriptionInvoiceType[]> {
    return this.listInvoices({ customerId });
  }

  async getOpenInvoices(): Promise<SubscriptionInvoiceType[]> {
    return this.listInvoices({ status: 'open' });
  }
}

export default SubscriptionInvoiceService;
