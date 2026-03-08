// @ts-nocheck - MedusaService
import { MedusaService } from '@medusajs/framework/utils';
import type { GenerateDownloadUrlInput, DownloadUrlResponse } from '@realizah/types';
import { getSignedDownloadUrl } from '../utils';

class DownloadManagerService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalPurchase: require('../models/digital-purchase').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalFile: require('../models/digital-file').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalProduct: require('../models/digital-product').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DownloadLog: require('../models/download-log').default,
}) {
  async generateDownloadUrl(data: GenerateDownloadUrlInput): Promise<DownloadUrlResponse> {
    // Get purchase
    const purchase = await this.retrieveDigitalPurchase(data.purchaseId);
    if (!purchase) {
      throw new Error('Purchase not found');
    }

    // Verify purchase status
    if (purchase.status !== 'active') {
      throw new Error(`Purchase is ${purchase.status}`);
    }

    // Check expiration
    if (purchase.expiresAt && new Date(purchase.expiresAt) <= new Date()) {
      throw new Error('Purchase has expired');
    }

    // Get product
    const product = await this.retrieveDigitalProduct(purchase.digitalProductId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check download limit
    if (product.downloadLimit && purchase.downloadCount >= product.downloadLimit) {
      throw new Error('Download limit reached');
    }

    // Get file
    const file = await this.retrieveDigitalFile(data.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Verify file belongs to product
    if (file.digitalProductId !== product.id) {
      throw new Error('File does not belong to this product');
    }

    // Generate signed URL (valid for 1 hour)
    const url = await getSignedDownloadUrl(file.storageKey, 3600);
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    // Log download
    await this.createDownloadLogs({
      digitalPurchaseId: purchase.id,
      digitalFileId: file.id,
      customerId: purchase.customerId,
      ipAddress: data.ipAddress || 'unknown',
      userAgent: data.userAgent,
      downloadedAt: new Date(),
    });

    // Increment download count
    await this.updateDigitalPurchases(purchase.id, {
      downloadCount: purchase.downloadCount + 1,
      lastDownloadAt: new Date(),
    });

    // Calculate remaining downloads
    const remainingDownloads = product.downloadLimit
      ? product.downloadLimit - (purchase.downloadCount + 1)
      : undefined;

    return {
      url,
      expiresAt,
      file: {
        id: file.id,
        name: file.name,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        checksum: file.checksum,
        checksumAlgorithm: 'SHA-256',
      },
      remainingDownloads,
    };
  }

  async verifyAccess(
    purchaseId: string,
    fileId: string,
  ): Promise<{
    hasAccess: boolean;
    reason?: string;
  }> {
    try {
      const purchase = await this.retrieveDigitalPurchase(purchaseId);
      const file = await this.retrieveDigitalFile(fileId);
      const product = await this.retrieveDigitalProduct(purchase.digitalProductId);

      // Check status
      if (purchase.status !== 'active') {
        return {
          hasAccess: false,
          reason: `Purchase is ${purchase.status}`,
        };
      }

      // Check expiration
      if (purchase.expiresAt && new Date(purchase.expiresAt) <= new Date()) {
        return {
          hasAccess: false,
          reason: 'Purchase has expired',
        };
      }

      // Check download limit
      if (product.downloadLimit && purchase.downloadCount >= product.downloadLimit) {
        return {
          hasAccess: false,
          reason: 'Download limit reached',
        };
      }

      // Verify file belongs to product
      if (file.digitalProductId !== product.id) {
        return {
          hasAccess: false,
          reason: 'File does not belong to this product',
        };
      }

      return { hasAccess: true };
    } catch (error) {
      return {
        hasAccess: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getRemainingDownloads(purchaseId: string): Promise<number | null> {
    const purchase = await this.retrieveDigitalPurchase(purchaseId);
    const product = await this.retrieveDigitalProduct(purchase.digitalProductId);

    if (!product.downloadLimit) {
      return null; // Unlimited
    }

    return Math.max(0, product.downloadLimit - purchase.downloadCount);
  }
}

export default DownloadManagerService;
