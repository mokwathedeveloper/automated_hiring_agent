// HACKATHON DEMO: Using KES pricing (Kenyan Shilling)
// Production will use NGN (Nigerian Naira) with proper business registration

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0, // Free tier
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
    price: 1250, // KSh 1,250 (Demo) ≈ ₦5,000 NGN (Production)
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
    price: 3750, // KSh 3,750 (Demo) ≈ ₦15,000 NGN (Production)
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
    price: 12500, // KSh 12,500 (Demo) ≈ ₦50,000 NGN (Production)
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
  resumeAnalysis: 25,  // KSh 25 per resume (Demo) ≈ ₦100 NGN (Production)
  bulkDiscount: 0.8,   // 20% discount for 50+ resumes
  apiAccess: 12        // KSh 12 per API call (Demo) ≈ ₦50 NGN (Production)
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

// Demo pricing functions (simplified for hackathon)
export const getPricingForCountry = (tier: PricingTier, country: string = 'KE') => {
  const baseTier = PRICING_TIERS[tier];

  return {
    ...baseTier,
    currency: 'KES',
    symbol: 'KSh',
    country: 'Kenya (Demo)',
    displayPrice: `KSh ${baseTier.price.toLocaleString()}`
  };
};

// Get pay-per-use pricing for demo
export const getPayPerUsePricing = (country: string = 'KE') => {
  return {
    resumeAnalysis: PAY_PER_USE.resumeAnalysis,
    apiAccess: PAY_PER_USE.apiAccess,
    bulkDiscount: PAY_PER_USE.bulkDiscount,
    currency: 'KES',
    symbol: 'KSh',
    displayResumePrice: `KSh ${PAY_PER_USE.resumeAnalysis}`
  };
};

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