// @ts-nocheck - MedusaService override conflicts
import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateSubscriptionPlanInput,
  UpdateSubscriptionPlanInput,
  SubscriptionPlan as SubscriptionPlanType,
} from '@realizah/types';

class SubscriptionPlanService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SubscriptionPlan: require('../models/subscription-plan').default,
}) {
  async createPlan(data: CreateSubscriptionPlanInput): Promise<SubscriptionPlanType> {
    const plan = await this.createSubscriptionPlans(data);
    return plan as SubscriptionPlanType;
  }

  async listPlans(filters?: {
    tier?: string;
    isActive?: boolean;
  }): Promise<SubscriptionPlanType[]> {
    const plans = await this.listSubscriptionPlans(filters);
    return plans as SubscriptionPlanType[];
  }

  async retrievePlan(planId: string): Promise<SubscriptionPlanType> {
    const plan = await this.retrieveSubscriptionPlan(planId);
    if (!plan) {
      throw new Error(`Subscription plan with id ${planId} not found`);
    }
    return plan as SubscriptionPlanType;
  }

  async updatePlan(
    planId: string,
    data: UpdateSubscriptionPlanInput,
  ): Promise<SubscriptionPlanType> {
    const plan = await this.updateSubscriptionPlans(planId, data);
    return plan as SubscriptionPlanType;
  }

  async deletePlan(planId: string): Promise<void> {
    await this.deleteSubscriptionPlans(planId);
  }

  async listActivePlans(): Promise<SubscriptionPlanType[]> {
    return this.listPlans({ isActive: true });
  }

  async getPlansByTier(tier: string): Promise<SubscriptionPlanType[]> {
    return this.listPlans({ tier });
  }
}

export default SubscriptionPlanService;
