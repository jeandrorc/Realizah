// @ts-nocheck - MedusaService updateAccessRules signature
import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateAccessRuleInput,
  UpdateAccessRuleInput,
  AccessRule as AccessRuleType,
} from '@realizah/types' with { "resolution-mode": "require" };

class AccessRuleService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AccessRule: require('../models/access-rule').default,
}) {
  async createRule(data: CreateAccessRuleInput): Promise<AccessRuleType> {
    const rule = await this.createAccessRules(data);
    return rule as AccessRuleType;
  }

  async listRules(filters?: {
    featureId?: string;
    customerId?: string;
    tier?: string;
  }): Promise<AccessRuleType[]> {
    const rules = await this.listAccessRules(filters);
    return rules as AccessRuleType[];
  }

  async retrieveRule(ruleId: string): Promise<AccessRuleType> {
    const rule = await this.retrieveAccessRule(ruleId);
    if (!rule) {
      throw new Error(`Access rule with id ${ruleId} not found`);
    }
    return rule as AccessRuleType;
  }

  async updateRule(ruleId: string, data: UpdateAccessRuleInput): Promise<AccessRuleType> {
    const rules = await this.updateAccessRules({ id: ruleId, ...data } as Record<string, unknown>);
    return (Array.isArray(rules) ? rules[0] : rules) as AccessRuleType;
  }

  async deleteRule(ruleId: string): Promise<void> {
    await this.deleteAccessRules(ruleId);
  }

  async getRulesForCustomer(customerId: string, featureId?: string): Promise<AccessRuleType[]> {
    const filters: { customerId: string; featureId?: string } = { customerId };
    if (featureId) {
      filters.featureId = featureId;
    }
    return this.listRules(filters);
  }

  async getRulesForFeature(featureId: string): Promise<AccessRuleType[]> {
    return this.listRules({ featureId });
  }

  async getActiveRules(): Promise<AccessRuleType[]> {
    const allRules = await this.listAccessRules();
    const now = new Date();
    return allRules.filter((rule) => !rule.expiresAt || rule.expiresAt > now) as AccessRuleType[];
  }

  async cleanupExpiredRules(): Promise<number> {
    const allRules = await this.listAccessRules();
    const now = new Date();
    const expiredRules = allRules.filter((rule) => rule.expiresAt && rule.expiresAt <= now);

    for (const rule of expiredRules) {
      await this.deleteAccessRules(rule.id);
    }

    return expiredRules.length;
  }
}

export default AccessRuleService;
