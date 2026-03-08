/**
 * Script to seed default features for each tier
 * Run with: medusa exec ./src/modules/access-control/scripts/seed-features.ts
 */

import type { MedusaContainer } from '@medusajs/framework/types';

export default async function seedFeatures({ container }: { container: MedusaContainer }) {
  const featureService = container.resolve('featureService');
  const logger = container.resolve('logger');

  const features = [
    // Free Tier Features
    {
      id: 'feat_free_courses',
      name: 'Free Courses Access',
      description: 'Access to free courses',
      category: 'courses',
      requiredTier: 'free' as const,
      isActive: true,
    },
    {
      id: 'feat_basic_tools',
      name: 'Basic Tools',
      description: 'Access to basic productivity tools',
      category: 'tools',
      requiredTier: 'free' as const,
      isActive: true,
    },
    {
      id: 'feat_email_support',
      name: 'Email Support',
      description: 'Support via email',
      category: 'support',
      requiredTier: 'free' as const,
      isActive: true,
    },

    // Pro Tier Features
    {
      id: 'feat_all_courses',
      name: 'All Courses Access',
      description: 'Unlimited access to all courses',
      category: 'courses',
      requiredTier: 'pro' as const,
      isActive: true,
    },
    {
      id: 'feat_advanced_tools',
      name: 'Advanced Tools',
      description: 'Access to advanced productivity tools',
      category: 'tools',
      requiredTier: 'pro' as const,
      isActive: true,
    },
    {
      id: 'feat_basic_analytics',
      name: 'Basic Analytics',
      description: 'Basic analytics and reporting',
      category: 'analytics',
      requiredTier: 'pro' as const,
      isActive: true,
    },
    {
      id: 'feat_priority_support',
      name: 'Priority Support',
      description: 'Priority email and chat support',
      category: 'support',
      requiredTier: 'pro' as const,
      isActive: true,
    },
    {
      id: 'feat_certificates',
      name: 'Course Certificates',
      description: 'Receive certificates upon course completion',
      category: 'courses',
      requiredTier: 'pro' as const,
      isActive: true,
    },

    // Premium Tier Features
    {
      id: 'feat_exclusive_courses',
      name: 'Exclusive Courses',
      description: 'Access to premium-only exclusive courses',
      category: 'courses',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_premium_tools',
      name: 'Premium Tools',
      description: 'Access to all premium tools and features',
      category: 'tools',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Advanced analytics with custom reports',
      category: 'analytics',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_one_on_one',
      name: '1-on-1 Consultancy',
      description: 'Personal consultancy sessions',
      category: 'support',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_24_7_support',
      name: '24/7 Support',
      description: 'Round-the-clock priority support',
      category: 'support',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_api_access',
      name: 'API Access',
      description: 'Full API access for integrations',
      category: 'developer',
      requiredTier: 'premium' as const,
      isActive: true,
    },
    {
      id: 'feat_white_label',
      name: 'White Label',
      description: 'White label branding options',
      category: 'branding',
      requiredTier: 'premium' as const,
      isActive: true,
    },
  ];

  logger.info('[Access Control] Starting feature seeding...');

  for (const featureData of features) {
    try {
      // Check if feature already exists
      const existing = await (featureService as { retrieveFeature: (id: string) => Promise<unknown> }).retrieveFeature(featureData.id);
      if (existing) {
        logger.info(`[Access Control] Feature ${featureData.id} already exists, skipping`);
        continue;
      }
    } catch {
      // Feature doesn't exist, create it
    }

    try {
      await (featureService as { createFeature: (data: unknown) => Promise<unknown> }).createFeature(featureData);
      logger.info(`[Access Control] Created feature: ${featureData.id}`);
    } catch (error) {
      logger.error(
        `[Access Control] Failed to create feature ${featureData.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  logger.info('[Access Control] Feature seeding completed!');
}
