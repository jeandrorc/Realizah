/**
 * Tipos do Subscription Module
 */

import type { BaseEntity, Tier } from './common';

export type SubscriptionInterval = 'monthly' | 'yearly';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  trialDays?: number;
  features: string[];
  tier: Tier;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface Subscription extends BaseEntity {
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  paymentMethodId?: string;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionInvoice extends BaseEntity {
  subscriptionId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt?: Date;
  paymentIntentId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSubscriptionPlanInput {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval: SubscriptionInterval;
  intervalCount?: number;
  trialDays?: number;
  features: string[];
  tier: Tier;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionPlanInput {
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateSubscriptionInput {
  customerId: string;
  planId: string;
  paymentMethodId?: string;
  metadata?: Record<string, unknown>;
}

export interface CancelSubscriptionInput {
  immediate?: boolean;
}
