// Subscription tiers - Matches Django backend CustomUser model subscription_tier field
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const SUBSCRIPTION_TIER_LABELS: Record<string, string> = {
  [SUBSCRIPTION_TIERS.FREE]: 'Free',
  [SUBSCRIPTION_TIERS.PRO]: 'Pro',
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 'Enterprise',
};

export const SUBSCRIPTION_TIER_FEATURES = {
  [SUBSCRIPTION_TIERS.FREE]: [
    'List up to 3 buses',
    'Basic booking management',
    'Email support',
    'Standard commission (15%)',
  ],
  [SUBSCRIPTION_TIERS.PRO]: [
    'List up to 15 buses',
    'Advanced booking management',
    'Priority support',
    'Reduced commission (10%)',
    'Analytics dashboard',
    'Custom availability blocking',
  ],
  [SUBSCRIPTION_TIERS.ENTERPRISE]: [
    'Unlimited buses',
    'Full booking management',
    'Dedicated support',
    'Lowest commission (5%)',
    'Advanced analytics',
    'API access',
    'White-label options',
    'Custom integrations',
  ],
};

export const SUBSCRIPTION_TIER_PRICES = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.PRO]: 999, // ₹999/month
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 4999, // ₹4999/month
};

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];
