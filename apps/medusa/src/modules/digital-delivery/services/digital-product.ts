import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateDigitalProductInput,
  UpdateDigitalProductInput,
  DigitalProduct as DigitalProductType,
} from '@realizah/types';

class DigitalProductService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalProduct: require('../models/digital-product').default,
}) {
  async createProduct(data: CreateDigitalProductInput): Promise<DigitalProductType> {
    const product = await this.createDigitalProducts({
      ...data,
      fileSize: 0,
    });
    return product as DigitalProductType;
  }

  async listProducts(filters?: {
    type?: string;
    requiredTier?: string;
  }): Promise<DigitalProductType[]> {
    const products = await this.listDigitalProducts(filters);
    return products as DigitalProductType[];
  }

  async retrieveProduct(productId: string): Promise<DigitalProductType> {
    const product = await this.retrieveDigitalProduct(productId);
    if (!product) {
      throw new Error(`Digital product with id ${productId} not found`);
    }
    return product as DigitalProductType;
  }

  async getProductByMedusaId(medusaProductId: string): Promise<DigitalProductType | null> {
    const products = await this.listDigitalProducts(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { productId: medusaProductId } as any,
    );
    return products[0] || null;
  }

  async updateProduct(
    productId: string,
    data: UpdateDigitalProductInput,
  ): Promise<DigitalProductType> {
    const product = await this.updateDigitalProducts(productId, data);
    return product as DigitalProductType;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.deleteDigitalProducts(productId);
  }

  async updateFileSize(productId: string, fileSize: number): Promise<void> {
    await this.updateDigitalProducts(productId, { fileSize });
  }

  async incrementFileSize(productId: string, increment: number): Promise<void> {
    const product = await this.retrieveProduct(productId);
    await this.updateFileSize(productId, product.fileSize + increment);
  }

  async decrementFileSize(productId: string, decrement: number): Promise<void> {
    const product = await this.retrieveProduct(productId);
    await this.updateFileSize(productId, Math.max(0, product.fileSize - decrement));
  }

  async getProductsByType(type: string): Promise<DigitalProductType[]> {
    return this.listProducts({ type });
  }

  async getProductsByTier(tier: string): Promise<DigitalProductType[]> {
    return this.listProducts({ requiredTier: tier });
  }
}

export default DigitalProductService;
