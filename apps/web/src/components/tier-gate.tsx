import Link from 'next/link'
import { hasAtLeastTier, type SubscriptionTier } from '@bizbridge/shared'

interface TierGateProps {
  userTier: SubscriptionTier
  required: SubscriptionTier
  children: React.ReactNode
  /** What to show when the user lacks the required tier. */
  fallback?: React.ReactNode
}

export function TierGate({ userTier, required, children, fallback }: TierGateProps) {
  if (hasAtLeastTier(userTier, required)) {
    return <>{children}</>
  }
  return <>{fallback ?? <DefaultUpgradeCTA required={required} />}</>
}

export function DefaultUpgradeCTA({ required }: { required: SubscriptionTier }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
        {required === 'pro' ? 'Pro' : 'Premium'} content
      </p>
      <p className="mt-2 text-slate-700">
        Unlock the full sector guide — step-by-step process, real fee ranges in ETB and USD,
        ministry approvals, downloadable templates, and the cost calculator.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          See pricing
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-brand-600 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
        >
          Create free account
        </Link>
      </div>
    </div>
  )
}
