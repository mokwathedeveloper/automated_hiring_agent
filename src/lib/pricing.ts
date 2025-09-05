export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    resumes: 5,
    features: ['basic_analysis', 'email_support'],
    limits: {
      monthlyResumes: 5,
      batchSize: 1,
      exportFormats: ['csv'],
      support: 'email'
    }
  },
  starter: {
    name: 'Starter', 
    price: 5000,
    resumes: 50,
    features: ['advanced_analysis', 'whatsapp', 'priority_support'],
    limits: {
      monthlyResumes: 50,
      batchSize: 5,
      exportFormats: ['csv', 'pdf'],
      support: 'priority'
    }
  },
  professional: {
    name: 'Professional',
    price: 15000,
    resumes: 200,
    features: ['bulk_processing', 'team_collaboration', 'analytics', 'api_access'],
    limits: {
      monthlyResumes: 200,
      batchSize: 10,
      exportFormats: ['csv', 'pdf', 'excel'],
      support: 'dedicated'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 50000,
    resumes: 'unlimited',
    features: ['custom_integration', 'dedicated_support', 'white_label', 'sla'],
    limits: {
      monthlyResumes: -1, // unlimited
      batchSize: 50,
      exportFormats: ['csv', 'pdf', 'excel', 'api'],
      support: 'dedicated'
    }
  }
} as const;

export const PAY_PER_USE = {
  resumeAnalysis: 100, // ₦100 per resume
  bulkDiscount: 0.8,   // 20% discount for 50+ resumes
  apiAccess: 50        // ₦50 per API call
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

export function getUserTier(user: any): PricingTier {
  // This would typically come from the database
  return user?.subscription?.tier || 'free';
}

export function canAccessFeature(userTier: PricingTier, feature: string): boolean {
  const tier = PRICING_TIERS[userTier];
  return (tier.features as readonly string[]).includes(feature);
}

export function getRemainingResumes(userTier: PricingTier, usedThisMonth: number): number {
  const tier = PRICING_TIERS[userTier];
  if (tier.limits.monthlyResumes === -1) return -1; // unlimited
  return Math.max(0, tier.limits.monthlyResumes - usedThisMonth);
}

export function canProcessBatch(userTier: PricingTier, batchSize: number): boolean {
  const tier = PRICING_TIERS[userTier];
  return batchSize <= tier.limits.batchSize;
}

export function calculatePayPerUse(resumeCount: number): number {
  const basePrice = resumeCount * PAY_PER_USE.resumeAnalysis;
  
  // Apply bulk discount for 50+ resumes
  if (resumeCount >= 50) {
    return Math.round(basePrice * PAY_PER_USE.bulkDiscount);
  }
  
  return basePrice;
}