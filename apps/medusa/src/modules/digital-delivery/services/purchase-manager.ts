import { MedusaService } from '@medusajs/framework/utils';
import type { DigitalPurchase as DigitalPurchaseType } from '@realizah/types';

class PurchaseManagerService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalPurchase: require('../models/digital-purchase').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalProduct: require('../models/digital-product').default,
}) {
  /**
   * Create purchases from Medusa order
   * Called when order.placed event is fired
   */
  async createPurchasesFromOrder(
    orderId: string,
    customerId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderItems: any[],
  ): Promise<DigitalPurchaseType[]> {
    const purchases: DigitalPurchaseType[] = [];

    for (const item of orderItems) {
      // Check if item is a digital product
      const isDigital = item.variant?.product?.metadata?.isDigital === true;
      if (!isDigital) {
        continue;
      }

      const digitalProductId = item.variant?.product?.metadata?.digitalProductId;
      if (!digitalProductId) {
        console.warn(
          `[PurchaseManager] Product ${item.variant?.product?.id} is marked as digital but has no digitalProductId`,
        );
        continue;
      }

      // Get digital product
      const product = await this.retrieveDigitalProduct(digitalProductId);
      if (!product) {
        console.warn(`[PurchaseManager] Digital product ${digitalProductId} not found`);
        continue;
      }

      // Check if purchase already exists
      const existing = await this.listDigitalPurchases({
        customerId,
        digitalProductId,
        orderId,
      });

      if (existing.length > 0) {
        console.log(
          `[PurchaseManager] Purchase already exists for customer ${customerId}, product ${digitalProductId}, order ${orderId}`,
        );
        continue;
      }

      // Calculate expiration
      const expiresAt = product.expirationDays
        ? new Date(Date.now() + product.expirationDays * 24 * 60 * 60 * 1000)
        : undefined;

      // Create purchase
      const purchase = await this.createDigitalPurchases({
        customerId,
        digitalProductId,
        orderId,
        status: 'pending',
        downloadCount: 0,
        expiresAt,
      });

      purchases.push(purchase as DigitalPurchaseType);
    }

    return purchases;
  }

  /**
   * Activate purchases for an order
   * Called when order.payment_captured event is fired
   */
  async activatePurchases(orderId: string): Promise<DigitalPurchaseType[]> {
    const purchases = await this.listDigitalPurchases({ orderId });

    const activated: DigitalPurchaseType[] = [];

    for (const purchase of purchases) {
      if (purchase.status === 'pending') {
        const updated = await this.updateDigitalPurchases(purchase.id, {
          status: 'active',
        });
        activated.push(updated as DigitalPurchaseType);
      }
    }

    return activated;
  }

  /**
   * Revoke purchases for an order
   * Called when order.canceled or order.refunded event is fired
   */
  async revokePurchases(orderId: string, reason?: string): Promise<DigitalPurchaseType[]> {
    const purchases = await this.listDigitalPurchases({ orderId });

    const revoked: DigitalPurchaseType[] = [];

    for (const purchase of purchases) {
      if (purchase.status === 'active' || purchase.status === 'pending') {
        const updated = await this.updateDigitalPurchases(purchase.id, {
          status: 'revoked',
          metadata: { revokedReason: reason },
        });
        revoked.push(updated as DigitalPurchaseType);
      }
    }

    return revoked;
  }

  /**
   * Check and update expired purchases
   * Should be run periodically (e.g., daily cron job)
   */
  async checkExpirations(): Promise<{
    checked: number;
    expired: number;
  }> {
    // Get all active purchases with expiration
    const purchases = await this.listDigitalPurchases({ status: 'active' });

    const now = new Date();
    let expired = 0;

    for (const purchase of purchases) {
      if (purchase.expiresAt && new Date(purchase.expiresAt) <= now) {
        await this.updateDigitalPurchases(purchase.id, { status: 'expired' });
        expired++;
      }
    }

    return {
      checked: purchases.length,
      expired,
    };
  }

  /**
   * Get purchase statistics for an order
   */
  async getOrderPurchaseStats(orderId: string) {
    const purchases = await this.listDigitalPurchases({ orderId });

    const stats = {
      total: purchases.length,
      pending: 0,
      active: 0,
      expired: 0,
      revoked: 0,
      totalDownloads: 0,
    };

    for (const purchase of purchases) {
      stats[purchase.status]++;
      stats.totalDownloads += purchase.downloadCount;
    }

    return stats;
  }
}

export default PurchaseManagerService;
