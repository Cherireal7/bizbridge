import type { SubscriptionTier } from '@bizbridge/shared'

interface GatedSectionProps {
  userTier: SubscriptionTier
  required: SubscriptionTier
  teaser: { title: string; description: string; bullets?: string[] }
  children: React.ReactNode
  className?: string
}

// Full-access mode: every section is always visible. When the paid tier is
// ready to launch, re-introduce the tier check + the paywall UI here.
export function GatedSection({ children, className }: GatedSectionProps) {
  return <div className={className}>{children}</div>
}
