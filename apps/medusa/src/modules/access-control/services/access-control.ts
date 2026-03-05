import { MedusaService } from '@medusajs/framework/utils';
import type {
  Tier,
  CustomerAccess as CustomerAccessType,
  FeatureAccess,
  GrantAccessInput,
  RevokeAccessInput,
} from '@realizah/types';

class AccessControlService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CustomerAccess: require('../models/customer-access').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Feature: require('../models/feature').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AccessRule: require('../models/access-rule').default,
}) {
  private tierHierarchy: Record<Tier, number> = {
    free: 0,
    pro: 1,
    premium: 2,
  };

  private compareTier(tier1: Tier, tier2: Tier): number {
    return this.tierHierarchy[tier1] - this.tierHierarchy[tier2];
  }

  async hasAccess(customerId: string, featureId: string): Promise<boolean> {
    // 1. Get customer tier
    const customerAccess = await this.getCustomerAccess(customerId);

    // 2. Get feature
    const feature = await this.retrieveFeature(featureId);
    if (!feature || !feature.isActive) {
      return false;
    }

    // 3. Check tier requirement
    if (this.compareTier(customerAccess.currentTier, feature.requiredTier) < 0) {
      // Tier insufficient, but check for custom rules
      const allowRule = await this.hasAllowRule(customerId, featureId);
      return allowRule;
    }

    // 4. Check for deny rules (even if tier is sufficient)
    const denyRule = await this.hasDenyRule(customerId, featureId);
    if (denyRule) {
      return false;
    }

    // 5. Tier is sufficient and no deny rules
    return true;
  }

  async getCustomerAccess(customerId: string): Promise<CustomerAccessType> {
    let access = await this.retrieveCustomerAccess(customerId);

    if (!access) {
      // Create default access for new customer
      access = await this.createCustomerAccesses({
        customerId,
        currentTier: 'free',
        features: [],
        lastSyncedAt: new Date(),
      });
    }

    return access as CustomerAccessType;
  }

  async updateCustomerTier(
    customerId: string,
    tier: Tier,
    subscriptionId?: string,
    subscriptionStatus?: string,
  ): Promise<CustomerAccessType> {
    const access = await this.getCustomerAccess(customerId);

    // Recalculate features based on new tier
    const features = await this.calculateAvailableFeatures(customerId, tier);

    const updated = await this.updateCustomerAccesses(access.customerId, {
      currentTier: tier,
      subscriptionId,
      subscriptionStatus,
      features: features.map((f) => f.id),
      lastSyncedAt: new Date(),
    });

    return updated as CustomerAccessType;
  }

  async calculateAvailableFeatures(customerId: string, tier: Tier): Promise<FeatureAccess[]> {
    const allFeatures = await this.listFeatures({ isActive: true });
    const featureAccess: FeatureAccess[] = [];

    for (const feature of allFeatures) {
      const hasAccess = await this.hasAccess(customerId, feature.id);
      let reason: FeatureAccess['reason'] = 'allowed';

      if (!hasAccess) {
        if (this.compareTier(tier, feature.requiredTier) < 0) {
          reason = 'tier_insufficient';
        } else {
          reason = 'custom_rule';
        }
      }

      featureAccess.push({
        feature,
        hasAccess,
        reason,
      });
    }

    return featureAccess;
  }

  async grantAccess(customerId: string, input: GrantAccessInput): Promise<void> {
    const feature = await this.retrieveFeature(input.featureId);
    if (!feature) {
      throw new Error(`Feature ${input.featureId} not found`);
    }

    await this.createAccessRules({
      featureId: input.featureId,
      customerId,
      action: 'allow',
      priority: 100,
      expiresAt: input.expiresAt,
      metadata: input.metadata,
    });

    // Update customer access cache
    await this.syncCustomerAccess(customerId);
  }

  async revokeAccess(customerId: string, input: RevokeAccessInput): Promise<void> {
    await this.createAccessRules({
      featureId: input.featureId,
      customerId,
      action: 'deny',
      priority: 200,
      metadata: { reason: input.reason },
    });

    // Update customer access cache
    await this.syncCustomerAccess(customerId);
  }

  async syncCustomerAccess(customerId: string): Promise<CustomerAccessType> {
    const access = await this.getCustomerAccess(customerId);
    const features = await this.calculateAvailableFeatures(customerId, access.currentTier);

    const updated = await this.updateCustomerAccesses(customerId, {
      features: features.filter((f) => f.hasAccess).map((f) => f.feature.id),
      lastSyncedAt: new Date(),
    });

    return updated as CustomerAccessType;
  }

  private async hasAllowRule(customerId: string, featureId: string): Promise<boolean> {
    const rules = await this.getActiveRulesForCustomerFeature(customerId, featureId);

    for (const rule of rules) {
      if (rule.action === 'allow') {
        return true;
      }
    }

    return false;
  }

  private async hasDenyRule(customerId: string, featureId: string): Promise<boolean> {
    const rules = await this.getActiveRulesForCustomerFeature(customerId, featureId);

    for (const rule of rules) {
      if (rule.action === 'deny') {
        return true;
      }
    }

    return false;
  }

  private async getActiveRulesForCustomerFeature(customerId: string, featureId: string) {
    const allRules = await this.listAccessRules({
      customerId,
      featureId,
    });

    const now = new Date();
    const activeRules = allRules.filter((rule) => !rule.expiresAt || rule.expiresAt > now);

    // Sort by priority (highest first)
    return activeRules.sort((a, b) => b.priority - a.priority);
  }
}

export default AccessControlService;
