import Link from 'next/link'
import { Lock } from 'lucide-react'
import { hasAtLeastTier, type SubscriptionTier } from '@bizbridge/shared'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface GatedSectionProps {
  userTier: SubscriptionTier
  required: SubscriptionTier
  /** What to advertise behind the gate when locked. */
  teaser: { title: string; description: string; bullets?: string[] }
  /** The real content, rendered when unlocked. */
  children: React.ReactNode
  className?: string
}

export function GatedSection({ userTier, required, teaser, children, className }: GatedSectionProps) {
  if (hasAtLeastTier(userTier, required)) {
    return <div className={className}>{children}</div>
  }
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/30">
            <Lock className="h-3 w-3" /> {required === 'pro' ? 'Pro' : 'Premium'}
          </div>
          <h3 className="text-lg font-semibold tracking-tightish text-ink">{teaser.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{teaser.description}</p>
          {teaser.bullets ? (
            <ul className="mt-3 grid gap-1 text-sm text-ink-muted">
              {teaser.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-brand">·</span>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Button asChild>
            <Link href="/pricing">See pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/signup">Free account</Link>
          </Button>
        </div>
      </div>
      <div className="border-t border-border bg-surface-2/40 p-6">
        <div className="pointer-events-none select-none opacity-50 blur-[6px]">{children}</div>
      </div>
    </Card>
  )
}
