/**
 * Tipos do Access Control Module
 */

import type { BaseEntity, Tier } from './common';

export type AccessAction = 'allow' | 'deny';

export interface Feature extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  requiredTier: Tier;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface AccessRule extends BaseEntity {
  featureId: string;
  customerId?: string;
  tier?: Tier;
  action: AccessAction;
  priority: number;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface CustomerAccess {
  customerId: string;
  currentTier: Tier;
  subscriptionId?: string;
  subscriptionStatus?: string;
  features: string[];
  lastSyncedAt: Date;
  expiresAt?: Date;
}

export interface CreateFeatureInput {
  name: string;
  description?: string;
  category: string;
  requiredTier: Tier;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateFeatureInput {
  name?: string;
  description?: string;
  category?: string;
  requiredTier?: Tier;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateAccessRuleInput {
  featureId: string;
  customerId?: string;
  tier?: Tier;
  action: AccessAction;
  priority?: number;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface UpdateAccessRuleInput {
  action?: AccessAction;
  priority?: number;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface ValidateAccessInput {
  featureId: string;
}

export interface GrantAccessInput {
  featureId: string;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface RevokeAccessInput {
  featureId: string;
  reason?: string;
}

export interface FeatureAccess {
  feature: Feature;
  hasAccess: boolean;
  reason?: 'tier_insufficient' | 'custom_rule' | 'subscription_expired' | 'allowed';
}
