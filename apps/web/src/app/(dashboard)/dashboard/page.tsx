import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckSquare,
  GitCompareArrows,
  Handshake,
  LineChart,
  Sparkles,
  Users,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth-server'
import { tryPayload } from '@/lib/payload'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/marketing/stat-card'
import { Sparkline } from '@/components/charts/sparkline'
import {
  DashboardActivityChart,
  DashboardSectorBreakdown,
} from '@/components/dashboard/dashboard-charts'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const data = await tryPayload(async (payload) => {
    const sectorTotal = await payload.find({
      collection: 'business-sectors',
      limit: 0,
      depth: 0,
    })
    const recent = await payload.find({
      collection: 'business-sectors',
      limit: 5,
      sort: '-updatedAt',
      depth: 0,
    })
    return { totalSectors: sectorTotal.totalDocs, recent: recent.docs }
  })

  const totalSectors = data?.totalSectors ?? 519
  const recent = data?.recent ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-ink-muted">
              {user ? `Welcome back, ${user.email.split('@')[0]}` : 'Welcome'}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tightish">Overview</h1>
          </div>
          {user ? (
            <Badge variant={user.tier === 'free' ? 'outline' : 'brand'}>
              {user.tier.toUpperCase()} TIER
            </Badge>
          ) : (
            <Badge variant="outline">Guest mode</Badge>
          )}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Sectors viewed"
          value="100"
          hint="Last 14 days"
          trend={{ value: 32, direction: 'up' }}
          visual={<Sparkline data={[2, 3, 5, 4, 7, 8, 9, 11, 14, 13, 16, 18, 22, 25]} color={1} />}
        />
        <StatCard
          label="Available sectors"
          value={totalSectors}
          hint="MOR Directive 17/2011"
        />
        <StatCard
          label="Active checklists"
          value="2"
          hint="Hospitality · F&B service"
          visual={<Sparkline data={[20, 25, 35, 42, 48, 55, 62, 70]} color={2} />}
        />
        <StatCard
          label="Partner intros sent"
          value={user?.tier === 'pro' ? '3' : '—'}
          hint={
            user?.tier === 'pro' ? 'Doxa Classic, Feeder Delivery, +1' : 'Pro tier benefit'
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardActivityChart />
        <DashboardSectorBreakdown />
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-faint">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/calculator"
            icon={Calculator}
            title="Estimate costs"
            body="Sliders, real-time totals."
          />
          <QuickAction
            href="/checklist"
            icon={CheckSquare}
            title="Start a checklist"
            body="Eight steps, your pace."
          />
          <QuickAction
            href="/compare"
            icon={GitCompareArrows}
            title="Compare sectors"
            body="Up to 3 side by side."
          />
          <QuickAction
            href="/partners"
            icon={Handshake}
            title="Browse partners"
            body="Vetted local operators."
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">Your plan</h2>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold tracking-tightish text-ink">
                {user?.tier === 'pro'
                  ? 'Pro · lifetime'
                  : user?.tier === 'basic'
                    ? 'Standard · lifetime'
                    : 'Free tier'}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {user?.tier === 'free' || !user
                  ? 'Browse 519 sectors, MOR lookup, wizard, basic data.'
                  : user?.tier === 'pro'
                    ? 'Full access · lawyer consult slot · partner intros.'
                    : 'Full sector guides + 3 research reports included.'}
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">
                {user?.tier === 'pro' ? 'Manage' : 'Upgrade'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 space-y-3">
            <FeatureUsage label="Sector overviews" value={100} cap="Unlimited" />
            <FeatureUsage
              label="Full setup process"
              value={user?.tier === 'free' || !user ? 12 : 100}
              cap={user?.tier === 'free' || !user ? 'Standard unlocks all' : 'All steps unlocked'}
            />
            <FeatureUsage
              label="Lawyer consult slot"
              value={user?.tier === 'pro' ? 100 : 0}
              cap={user?.tier === 'pro' ? '1 slot available · book anytime' : 'Pro tier only'}
            />
            <FeatureUsage
              label="Partner introductions"
              value={user?.tier === 'pro' ? 60 : 0}
              cap={user?.tier === 'pro' ? '3 of 5 used' : 'Pro tier only'}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">
            Recommended next
          </h2>
          <div className="mt-3 space-y-3">
            <Recommendation
              icon={Sparkles}
              title="Run the wizard"
              body="5 questions → 3 sector picks"
              href="/wizard"
            />
            <Recommendation
              icon={LineChart}
              title="Open Bishoftu Pulse"
              body="Live city indicators"
              href="/bishoftu"
            />
            <Recommendation
              icon={Handshake}
              title="Meet our partners"
              body="6 vetted local operators"
              href="/partners"
            />
            <Recommendation
              icon={Users}
              title="Talk to a lawyer"
              body="Pro · 30-min call slot"
              href="/lawyer"
            />
          </div>
        </Card>
      </section>

      {recent.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-faint">
            Recently updated sectors
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((s) => (
              <Link
                key={s.id}
                href={`/sectors/${s.slug}`}
                className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand/40"
              >
                <Badge variant="mono">{s.mor_code}</Badge>
                <p className="mt-3 line-clamp-2 text-sm font-medium text-ink group-hover:text-brand">
                  {s.name_en}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-brand/40 hover:bg-surface-2"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand/15 text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink group-hover:text-brand">{title}</p>
      <p className="mt-1 text-xs text-ink-muted">{body}</p>
    </Link>
  )
}

function Recommendation({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md border border-border bg-bg/40 p-3 transition-colors hover:border-brand/40"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/15 text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{body}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />
    </Link>
  )
}

function FeatureUsage({ label, value, cap }: { label: string; value: number; cap: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="text-ink-faint">{cap}</span>
      </div>
      <Progress value={value} className="mt-1.5" />
    </div>
  )
}
