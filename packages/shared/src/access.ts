import type { SubscriptionTier } from './constants.js'

export const ACCESS = {
  free: [
    'sector.name',
    'sector.description_short',
    'sector.category',
    'sector.steps[0]',
    'sector.costs.range_teaser',
    'market_research.free',
    'blog_posts',
  ],
  premium: [
    'sector.*',
    'sector.steps.*',
    'sector.costs.*',
    'sector.documents.*',
    'reports.*',
    'market_research.*',
    'calculator.*',
    'checklist.*',
  ],
  expert: ['experts.booking', 'bookings.*'],
} as const

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
}

export function hasAtLeastTier(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier]
}

export function canAccessPremium(userTier: SubscriptionTier): boolean {
  return hasAtLeastTier(userTier, 'basic')
}
