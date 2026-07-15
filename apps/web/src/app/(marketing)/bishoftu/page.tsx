import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, TrendingUp } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/marketing/stat-card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { GeometricIcon } from '@/components/marketing/geometric-icon'
import { Sparkline } from '@/components/charts/sparkline'
import { PulseCharts } from './pulse-charts'

export const metadata: Metadata = {
  title: 'Bishoftu Pulse · live business intelligence',
  description:
    'Live(ish) business intelligence for Bishoftu/Debrezeit. Population, FX rate, trending sectors, airport project timeline, and the top business opportunities ranked by readiness.',
}

export const revalidate = 600

const OPPORTUNITIES = [
  { rank: 1, name: 'Boutique tourism / agritourism', sector_mor: '64116', readiness: 92 },
  { rank: 2, name: 'F&B (cafe / restaurant / cloud kitchen)', sector_mor: '64114', readiness: 88 },
  { rank: 3, name: 'Event coordination', sector_mor: '72121', readiness: 82 },
  { rank: 4, name: 'Adventure / lake tourism', sector_mor: '72111', readiness: 78 },
  { rank: 5, name: 'Guesthouse / pension', sector_mor: '64117', readiness: 76 },
  { rank: 6, name: 'Digital marketing & content', sector_mor: '86811', readiness: 74 },
  { rank: 7, name: 'Cold storage & logistics', sector_mor: '74112', readiness: 70 },
  { rank: 8, name: 'Agribusiness / dairy processing', sector_mor: '31115', readiness: 68 },
  { rank: 9, name: 'Vocational training centers', sector_mor: '91115', readiness: 64 },
  { rank: 10, name: 'Construction supply (post-airport boom)', sector_mor: '61831', readiness: 60 },
]

const AIRPORT_PHASES = [
  { phase: 'Land acquisition & EIA', start: '2026-01', end: '2026-08', status: 'active' },
  { phase: 'Earthworks & runway base', start: '2026-08', end: '2027-12', status: 'planned' },
  { phase: 'Terminal construction', start: '2027-06', end: '2029-04', status: 'planned' },
  { phase: 'Systems & finishing', start: '2029-04', end: '2030-03', status: 'planned' },
  { phase: 'Phase 1 operations', start: '2030-03', end: '2030-12', status: 'planned' },
] as const

const SECTOR_TRENDING = [
  { label: 'Tourism & Hospitality', value: 28 },
  { label: 'Food & Beverage', value: 24 },
  { label: 'Construction & Materials', value: 18 },
  { label: 'Logistics & Storage', value: 14 },
  { label: 'Agribusiness', value: 9 },
  { label: 'Other', value: 7 },
]

const FX_HISTORY = [54.2, 55.0, 55.6, 55.9, 56.3, 56.8, 57.2, 57.6, 58.1]

export default async function BishoftuPage() {
  // Pull featured-by-MOR sectors so the links land on real seeded data
  const popularSectorMorCodes = OPPORTUNITIES.map((o) => o.sector_mor)
  const sectorMap = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'business-sectors',
      where: { mor_code: { in: popularSectorMorCodes } },
      limit: 50,
      depth: 0,
    })
    return new Map(r.docs.map((s) => [s.mor_code, s.slug]))
  })

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16">
          <Badge variant="accent" className="mb-5 inline-flex">
            <MapPin className="h-3 w-3" /> Bishoftu Pulse · live indicators
          </Badge>
          <h1 className="text-balance text-5xl font-semibold tracking-crisp sm:text-6xl">
            Bishoftu, in numbers.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            Live(ish) economic indicators for Bishoftu and Debrezeit — population, FX, sectors
            trending up, and the $12.5B airport phase that will reshape it all by 2030.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link href="/sectors">
                Browse 519 sectors <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/compare">Compare sectors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI ROW */}
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Population"
            value="245k"
            hint="3.2% YoY · 410k by 2032 projected"
            trend={{ value: 3.2, direction: 'up' }}
          />
          <StatCard
            label="ETB / USD"
            value={`₿ ${FX_HISTORY[FX_HISTORY.length - 1]?.toFixed(1)}`}
            hint="Indicative interbank rate, 9-week trend"
            trend={{ value: 7.2, direction: 'up' }}
            visual={<Sparkline data={FX_HISTORY} color={3} />}
          />
          <StatCard
            label="Top trending sector"
            value="Tourism"
            hint="28% of new Bishoftu registrations YTD"
            trend={{ value: 11, direction: 'up' }}
          />
          <StatCard
            label="Airport investment"
            value="$12.5B"
            hint="6,000 ha · 100M pax capacity"
            trend={{ value: 0, direction: 'flat' }}
          />
        </div>
      </section>

      {/* CHARTS */}
      <section className="container-page py-8">
        <PulseCharts trending={SECTOR_TRENDING} phases={AIRPORT_PHASES} fxHistory={FX_HISTORY} />
      </section>

      {/* OPPORTUNITIES */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand">Opportunities</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              Top 10 Bishoftu business opportunities
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Ranked by readiness — market timing × capital intensity × airport-leverage.
              Readiness 90+ = open within 12 months. 60–80 = strong position for 2027 launch.
            </p>
          </div>
        </div>
        <Card className="overflow-hidden">
          <div className="grid divide-y divide-border">
            {OPPORTUNITIES.map((o) => {
              const slug = sectorMap?.get(o.sector_mor)
              return (
                <div key={o.rank} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-surface-2/40">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 font-mono text-sm font-semibold text-ink">
                    {o.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{o.name}</p>
                    <p className="text-xs text-ink-faint">
                      MOR <span className="font-mono">{o.sector_mor}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden w-32 sm:block">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full bg-gradient-to-r from-brand to-accent"
                            style={{ width: `${o.readiness}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-ink-muted">{o.readiness}</span>
                      </div>
                    </div>
                    {slug ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/sectors/${slug}`}>
                          Open <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* CITY VITALS */}
      <section className="border-t border-border bg-surface">
        <div className="container-page py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-brand">City vitals</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              What Bishoftu is, by the numbers
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <VitalCard label="Distance to Addis" value="45 km" hint="50 min by car" />
            <VitalCard label="Elevation" value="1,920m" hint="Highland climate" />
            <VitalCard label="Languages" value="Amharic · Afaan Oromo" hint="EN widely understood" />
            <VitalCard label="Lakes" value="5" hint="Hora · Bishoftu · Bishoftu Guda · Kuriftu · Hora Kilolé" />
            <VitalCard label="Annual visitors" value="1.2M" hint="40% leisure, 60% transit" />
            <VitalCard label="Federal HQ" value="Air Force" hint="Major employer & demand driver" />
            <VitalCard label="Industrial parks" value="2" hint="Modjo Leather City · Eastern Industrial Zone" />
            <VitalCard label="Mean temp" value="19°C" hint="14–25°C year-round" />
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Why now</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Pre-airport land prices in the impact zone are already 3-4x 2022 levels but
                still 60-70% below where they will trade once Phase 1 is operational. Window
                closes fast for capital-light services.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-accent">Why diaspora</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Foreign currency inflows under the Investment Proclamation get preferential
                treatment, and Bishoftu&apos;s proximity to Addis cuts the &quot;diaspora tax&quot;
                that pure-rural sites carry.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-warn">Risks to price in</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Currency volatility (ETB has slipped ~7% in 9 weeks), regional security, and
                regulatory tempo. Premium subscribers see the full risk matrix per sector.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-page py-16 sm:py-20">
          <Card className="relative overflow-hidden p-7 sm:p-12">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand">Bishoftu market research</p>
                <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tightish sm:text-4xl">
                  Get the full report — fees, timelines, partner intros, all sectors.
                </h2>
                <p className="mt-4 text-pretty text-ink-muted">
                  Everything you see above is the public preview. Standard unlocks 519 sector
                  guides + the calculator + checklist. Pro adds a 30-minute lawyer consult and
                  warm intros to our local partner network — Doxa Classic, Feeder Delivery, and
                  more.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/pricing">
                    See pricing <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/partners">Browse partners</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

function VitalCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tightish text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{hint}</p>
    </Card>
  )
}
