import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateFeatureInput,
  UpdateFeatureInput,
  Feature as FeatureType,
} from '@realizah/types';

class FeatureService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Feature: require('../models/feature').default,
}) {
  async createFeature(data: CreateFeatureInput): Promise<FeatureType> {
    const feature = await this.createFeatures(data);
    return feature as FeatureType;
  }

  async listFeatures(filters?: {
    category?: string;
    requiredTier?: string;
    isActive?: boolean;
  }): Promise<FeatureType[]> {
    const features = await this.listFeatures(filters);
    return features as FeatureType[];
  }

  async retrieveFeature(featureId: string): Promise<FeatureType> {
    const feature = await this.retrieveFeature(featureId);
    if (!feature) {
      throw new Error(`Feature with id ${featureId} not found`);
    }
    return feature as FeatureType;
  }

  async updateFeature(featureId: string, data: UpdateFeatureInput): Promise<FeatureType> {
    const feature = await this.updateFeatures(featureId, data);
    return feature as FeatureType;
  }

  async deleteFeature(featureId: string): Promise<void> {
    await this.deleteFeatures(featureId);
  }

  async listActiveFeatures(): Promise<FeatureType[]> {
    return this.listFeatures({ isActive: true });
  }

  async getFeaturesByCategory(category: string): Promise<FeatureType[]> {
    return this.listFeatures({ category });
  }

  async getFeaturesByTier(tier: string): Promise<FeatureType[]> {
    return this.listFeatures({ requiredTier: tier });
  }
}

export default FeatureService;
