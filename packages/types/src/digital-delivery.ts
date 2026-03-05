/**
 * Tipos do Digital Delivery Module
 */

import type { BaseEntity, Tier } from './common';

export type ProductType =
  | 'ebook'
  | 'template'
  | 'software'
  | 'audio'
  | 'video'
  | 'document'
  | 'other';

export type PurchaseStatus = 'pending' | 'active' | 'expired' | 'revoked';

export interface DigitalProduct extends BaseEntity {
  productId: string;
  name: string;
  description?: string;
  type: ProductType;
  files: DigitalFile[];
  downloadLimit?: number;
  expirationDays?: number;
  fileSize: number;
  requiredTier?: Tier;
  metadata?: Record<string, unknown>;
}

export interface DigitalFile extends BaseEntity {
  digitalProductId: string;
  name: string;
  description?: string;
  storageKey: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  metadata?: Record<string, unknown>;
}

export interface DigitalPurchase extends BaseEntity {
  customerId: string;
  digitalProductId: string;
  orderId: string;
  status: PurchaseStatus;
  downloadCount: number;
  lastDownloadAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface DownloadLog {
  id: string;
  digitalPurchaseId: string;
  digitalFileId: string;
  customerId: string;
  ipAddress: string;
  userAgent: string;
  downloadedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CreateDigitalProductInput {
  productId: string;
  name: string;
  description?: string;
  type: ProductType;
  downloadLimit?: number;
  expirationDays?: number;
  requiredTier?: Tier;
  metadata?: Record<string, unknown>;
}

export interface UpdateDigitalProductInput {
  name?: string;
  description?: string;
  type?: ProductType;
  downloadLimit?: number;
  expirationDays?: number;
  requiredTier?: Tier;
  metadata?: Record<string, unknown>;
}

export interface UploadFileInput {
  digitalProductId: string;
  name: string;
  description?: string;
  fileBuffer: Uint8Array;
  mimeType: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePurchaseInput {
  customerId: string;
  digitalProductId: string;
  orderId: string;
  expirationDays?: number;
}

export interface GenerateDownloadUrlInput {
  purchaseId: string;
  fileId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DownloadUrlResponse {
  url: string;
  expiresAt: Date;
  file: {
    id: string;
    name: string;
    fileSize: number;
    mimeType: string;
    checksum: string;
    checksumAlgorithm: string;
  };
  remainingDownloads?: number;
}

export interface PurchaseWithProduct extends DigitalPurchase {
  product: DigitalProduct;
}

export interface DownloadStats {
  totalDownloads: number;
  uniqueCustomers: number;
  totalFileSize: number;
  downloadsByProduct: Array<{
    productId: string;
    productName: string;
    downloads: number;
  }>;
  recentDownloads: Array<{
    customerId: string;
    productName: string;
    fileName: string;
    downloadedAt: Date;
  }>;
}

export interface FileValidation {
  isValid: boolean;
  errors: string[];
  maxFileSize?: number;
  allowedMimeTypes?: string[];
}
