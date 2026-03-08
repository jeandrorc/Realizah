// @ts-nocheck - MedusaService override conflicts
import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateSubscriptionInput,
  CancelSubscriptionInput,
  Subscription as SubscriptionType,
} from '@realizah/types';
import { addDays, addMonths } from '@realizah/utils';

class SubscriptionService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Subscription: require('../models/subscription').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SubscriptionPlan: require('../models/subscription-plan').default,
}) {
  async createSubscription(data: CreateSubscriptionInput): Promise<SubscriptionType> {
    const plan = await this.retrieveSubscriptionPlan(data.planId);
    if (!plan) {
      throw new Error(`Plan with id ${data.planId} not found`);
    }

    const now = new Date();
    const trialEnd = plan.trialDays ? addDays(now, plan.trialDays) : undefined;
    const periodStart = trialEnd || now;
    const periodEnd =
      plan.interval === 'monthly'
        ? addMonths(periodStart, plan.intervalCount)
        : addMonths(periodStart, plan.intervalCount * 12);

    const subscription = await this.createSubscriptions({
      customerId: data.customerId,
      planId: data.planId,
      status: trialEnd ? 'trialing' : 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      trialStart: trialEnd ? now : undefined,
      trialEnd,
      paymentMethodId: data.paymentMethodId,
      metadata: data.metadata,
    });

    return subscription as SubscriptionType;
  }

  async listSubscriptions(filters?: {
    customerId?: string;
    status?: string;
  }): Promise<SubscriptionType[]> {
    const subscriptions = await this.listSubscriptions(filters);
    return subscriptions as SubscriptionType[];
  }

  async retrieveSubscription(subscriptionId: string): Promise<SubscriptionType> {
    const subscription = await this.retrieveSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription with id ${subscriptionId} not found`);
    }
    return subscription as SubscriptionType;
  }

  async cancelSubscription(
    subscriptionId: string,
    input: CancelSubscriptionInput,
  ): Promise<SubscriptionType> {
    const subscription = await this.retrieveSubscription(subscriptionId);

    if (input.immediate) {
      const updated = await this.updateSubscriptions(subscriptionId, {
        status: 'canceled',
        canceledAt: new Date(),
      });
      return updated as SubscriptionType;
    } else {
      const updated = await this.updateSubscriptions(subscriptionId, {
        cancelAt: subscription.currentPeriodEnd,
      });
      return updated as SubscriptionType;
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<SubscriptionType> {
    const subscription = await this.retrieveSubscription(subscriptionId);

    if (!subscription.cancelAt) {
      throw new Error('Subscription is not scheduled for cancellation');
    }

    if (new Date() > subscription.currentPeriodEnd) {
      throw new Error('Subscription period has already ended');
    }

    const updated = await this.updateSubscriptions(subscriptionId, {
      cancelAt: null,
      status: 'active',
    });

    return updated as SubscriptionType;
  }

  async renewSubscription(subscriptionId: string): Promise<SubscriptionType> {
    const subscription = await this.retrieveSubscription(subscriptionId);
    const plan = await this.retrieveSubscriptionPlan(subscription.planId);

    const newPeriodStart = subscription.currentPeriodEnd;
    const newPeriodEnd =
      plan.interval === 'monthly'
        ? addMonths(newPeriodStart, plan.intervalCount)
        : addMonths(newPeriodStart, plan.intervalCount * 12);

    const updated = await this.updateSubscriptions(subscriptionId, {
      currentPeriodStart: newPeriodStart,
      currentPeriodEnd: newPeriodEnd,
      status: 'active',
    });

    return updated as SubscriptionType;
  }

  async getCustomerSubscriptions(customerId: string): Promise<SubscriptionType[]> {
    return this.listSubscriptions({ customerId });
  }

  async getActiveSubscription(customerId: string): Promise<SubscriptionType | null> {
    const subscriptions = await this.listSubscriptions({
      customerId,
      status: 'active',
    });
    return subscriptions[0] || null;
  }
}

export default SubscriptionService;
