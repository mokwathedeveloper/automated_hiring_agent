import { 
  getUserTier, 
  canAccessFeature, 
  getRemainingResumes, 
  canProcessBatch, 
  calculatePayPerUse,
  PRICING_TIERS,
  PAY_PER_USE
} from '@/lib/pricing'

describe('pricing', () => {
  describe('getUserTier', () => {
    it('returns free tier for user without subscription', () => {
      const user = {}
      expect(getUserTier(user)).toBe('free')
    })

    it('returns user subscription tier', () => {
      const user = { subscription: { tier: 'professional' } }
      expect(getUserTier(user)).toBe('professional')
    })

    it('defaults to free for null user', () => {
      expect(getUserTier(null)).toBe('free')
    })
  })

  describe('canAccessFeature', () => {
    it('allows free tier features for free users', () => {
      expect(canAccessFeature('free', 'basic_analysis')).toBe(true)
      expect(canAccessFeature('free', 'email_support')).toBe(true)
    })

    it('denies premium features for free users', () => {
      expect(canAccessFeature('free', 'whatsapp')).toBe(false)
      expect(canAccessFeature('free', 'bulk_processing')).toBe(false)
    })

    it('allows starter tier features', () => {
      expect(canAccessFeature('starter', 'advanced_analysis')).toBe(true)
      expect(canAccessFeature('starter', 'whatsapp')).toBe(true)
      expect(canAccessFeature('starter', 'priority_support')).toBe(true)
    })

    it('allows professional tier features', () => {
      expect(canAccessFeature('professional', 'bulk_processing')).toBe(true)
      expect(canAccessFeature('professional', 'team_collaboration')).toBe(true)
      expect(canAccessFeature('professional', 'analytics')).toBe(true)
    })

    it('allows enterprise tier features', () => {
      expect(canAccessFeature('enterprise', 'custom_integration')).toBe(true)
      expect(canAccessFeature('enterprise', 'white_label')).toBe(true)
    })
  })

  describe('getRemainingResumes', () => {
    it('calculates remaining resumes for free tier', () => {
      expect(getRemainingResumes('free', 2)).toBe(3) // 5 - 2 = 3
      expect(getRemainingResumes('free', 5)).toBe(0) // 5 - 5 = 0
      expect(getRemainingResumes('free', 6)).toBe(0) // max(0, 5 - 6) = 0
    })

    it('calculates remaining resumes for starter tier', () => {
      expect(getRemainingResumes('starter', 10)).toBe(40) // 50 - 10 = 40
    })

    it('returns unlimited for enterprise tier', () => {
      expect(getRemainingResumes('enterprise', 1000)).toBe(-1) // unlimited
    })

    it('handles zero usage', () => {
      expect(getRemainingResumes('free', 0)).toBe(5)
      expect(getRemainingResumes('starter', 0)).toBe(50)
    })
  })

  describe('canProcessBatch', () => {
    it('allows batch processing within limits', () => {
      expect(canProcessBatch('free', 1)).toBe(true)
      expect(canProcessBatch('starter', 5)).toBe(true)
      expect(canProcessBatch('professional', 10)).toBe(true)
      expect(canProcessBatch('enterprise', 50)).toBe(true)
    })

    it('denies batch processing over limits', () => {
      expect(canProcessBatch('free', 2)).toBe(false)
      expect(canProcessBatch('starter', 6)).toBe(false)
      expect(canProcessBatch('professional', 11)).toBe(false)
      expect(canProcessBatch('enterprise', 51)).toBe(false)
    })

    it('handles edge cases', () => {
      expect(canProcessBatch('free', 0)).toBe(true)
      expect(canProcessBatch('starter', 1)).toBe(true)
    })
  })

  describe('calculatePayPerUse', () => {
    it('calculates basic pay per use pricing', () => {
      expect(calculatePayPerUse(1)).toBe(25) // 1 * 25
      expect(calculatePayPerUse(10)).toBe(250) // 10 * 25
      expect(calculatePayPerUse(25)).toBe(625) // 25 * 25
    })

    it('applies bulk discount for 50+ resumes', () => {
      const basePrice = 50 * PAY_PER_USE.resumeAnalysis // 1250
      const discountedPrice = Math.round(basePrice * PAY_PER_USE.bulkDiscount) // 1000

      expect(calculatePayPerUse(50)).toBe(discountedPrice)
      expect(calculatePayPerUse(100)).toBe(Math.round(2500 * 0.8)) // 2000
    })

    it('handles zero resumes', () => {
      expect(calculatePayPerUse(0)).toBe(0)
    })

    it('handles large numbers', () => {
      const result = calculatePayPerUse(1000)
      expect(result).toBe(Math.round(25000 * 0.8)) // bulk discount applied
    })
  })

  describe('PRICING_TIERS constant', () => {
    it('has all required tiers', () => {
      expect(PRICING_TIERS).toHaveProperty('free')
      expect(PRICING_TIERS).toHaveProperty('starter')
      expect(PRICING_TIERS).toHaveProperty('professional')
      expect(PRICING_TIERS).toHaveProperty('enterprise')
    })

    it('has correct structure for each tier', () => {
      Object.values(PRICING_TIERS).forEach(tier => {
        expect(tier).toHaveProperty('name')
        expect(tier).toHaveProperty('price')
        expect(tier).toHaveProperty('resumes')
        expect(tier).toHaveProperty('features')
        expect(tier).toHaveProperty('limits')
        expect(Array.isArray(tier.features)).toBe(true)
      })
    })
  })

  describe('PAY_PER_USE constant', () => {
    it('has required properties', () => {
      expect(PAY_PER_USE).toHaveProperty('resumeAnalysis')
      expect(PAY_PER_USE).toHaveProperty('bulkDiscount')
      expect(PAY_PER_USE).toHaveProperty('apiAccess')
    })

    it('has reasonable values', () => {
      expect(PAY_PER_USE.resumeAnalysis).toBeGreaterThan(0)
      expect(PAY_PER_USE.bulkDiscount).toBeLessThan(1)
      expect(PAY_PER_USE.bulkDiscount).toBeGreaterThan(0)
      expect(PAY_PER_USE.apiAccess).toBeGreaterThan(0)
    })
  })
})