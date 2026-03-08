// @ts-nocheck - MedusaService override conflicts
import { MedusaService } from '@medusajs/framework/utils';
import type { CreatePurchaseInput, DigitalPurchase as DigitalPurchaseType } from '@realizah/types';

class DigitalPurchaseService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalPurchase: require('../models/digital-purchase').default,
}) {
  async createPurchase(data: CreatePurchaseInput): Promise<DigitalPurchaseType> {
    const expiresAt = data.expirationDays
      ? new Date(Date.now() + data.expirationDays * 24 * 60 * 60 * 1000)
      : undefined;

    const purchase = await this.createDigitalPurchases({
      customerId: data.customerId,
      digitalProductId: data.digitalProductId,
      orderId: data.orderId,
      status: 'pending',
      downloadCount: 0,
      expiresAt,
    });

    return purchase as DigitalPurchaseType;
  }

  async listPurchases(filters?: {
    customerId?: string;
    digitalProductId?: string;
    orderId?: string;
    status?: string;
  }): Promise<DigitalPurchaseType[]> {
    const purchases = await this.listDigitalPurchases(filters);
    return purchases as DigitalPurchaseType[];
  }

  async retrievePurchase(purchaseId: string): Promise<DigitalPurchaseType> {
    const purchase = await this.retrieveDigitalPurchase(purchaseId);
    if (!purchase) {
      throw new Error(`Digital purchase with id ${purchaseId} not found`);
    }
    return purchase as DigitalPurchaseType;
  }

  async getPurchase(
    customerId: string,
    digitalProductId: string,
    orderId: string,
  ): Promise<DigitalPurchaseType | null> {
    const purchases = await this.listPurchases({
      customerId,
      digitalProductId,
      orderId,
    });
    return purchases[0] || null;
  }

  async activatePurchase(purchaseId: string): Promise<DigitalPurchaseType> {
    const purchase = await this.updateDigitalPurchases(purchaseId, {
      status: 'active',
    });
    return purchase as DigitalPurchaseType;
  }

  async revokePurchase(purchaseId: string, reason?: string): Promise<DigitalPurchaseType> {
    const purchase = await this.updateDigitalPurchases(purchaseId, {
      status: 'revoked',
      metadata: { revokedReason: reason },
    });
    return purchase as DigitalPurchaseType;
  }

  async renewPurchase(purchaseId: string, expirationDays: number): Promise<DigitalPurchaseType> {
    const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

    const purchase = await this.updateDigitalPurchases(purchaseId, {
      status: 'active',
      expiresAt,
    });

    return purchase as DigitalPurchaseType;
  }

  async incrementDownloadCount(purchaseId: string): Promise<void> {
    const purchase = await this.retrievePurchase(purchaseId);
    await this.updateDigitalPurchases(purchaseId, {
      downloadCount: purchase.downloadCount + 1,
      lastDownloadAt: new Date(),
    });
  }

  async getCustomerPurchases(customerId: string): Promise<DigitalPurchaseType[]> {
    return this.listPurchases({ customerId });
  }

  async getActivePurchases(customerId: string): Promise<DigitalPurchaseType[]> {
    const purchases = await this.listPurchases({ customerId, status: 'active' });

    // Filter out expired purchases
    const now = new Date();
    return purchases.filter((p) => !p.expiresAt || new Date(p.expiresAt) > now);
  }

  async checkExpiration(purchaseId: string): Promise<boolean> {
    const purchase = await this.retrievePurchase(purchaseId);

    if (!purchase.expiresAt) {
      return false; // No expiration
    }

    const now = new Date();
    const isExpired = new Date(purchase.expiresAt) <= now;

    if (isExpired && purchase.status === 'active') {
      await this.updateDigitalPurchases(purchaseId, { status: 'expired' });
    }

    return isExpired;
  }

  async getPurchasesByOrder(orderId: string): Promise<DigitalPurchaseType[]> {
    return this.listPurchases({ orderId });
  }
}

export default DigitalPurchaseService;
