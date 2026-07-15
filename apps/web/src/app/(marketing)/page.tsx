import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Code2, Handshake, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { GeometricIcon } from '@/components/marketing/geometric-icon'
import { StatCard } from '@/components/marketing/stat-card'
import { Sparkline } from '@/components/charts/sparkline'
import { HomeCharts } from '@/components/marketing/home-charts'
import { PartnersLogoBar } from '@/components/marketing/partners-strip'
import { CONSULT_TELEGRAM } from '@/lib/flags'

const FOUNDER_SECTOR_CODES = ['39141', '72131', '92191']

export const revalidate = 600

export default async function HomePage() {
  const data = await tryPayload(async (payload) => {
    const categories = await payload.find({
      collection: 'sector-categories',
      sort: 'sort_order',
      limit: 20,
    })
    const counts = await Promise.all(
      categories.docs.map(async (c) => {
        const r = await payload.find({
          collection: 'business-sectors',
          where: { category: { equals: c.id }, is_active: { equals: true } },
          limit: 0,
          depth: 0,
        })
        return { id: c.id, slug: c.slug, name: c.name_en, total: r.totalDocs }
      }),
    )
    const featured = await payload.find({
      collection: 'business-sectors',
      where: { is_active: { equals: true } },
      limit: 6,
      depth: 1,
      sort: '-updatedAt',
    })
    const sectorTotal = await payload.find({
      collection: 'business-sectors',
      limit: 0,
      depth: 0,
    })
    const blogPosts = await payload
      .find({ collection: 'blog-posts', limit: 3, sort: '-published_at', depth: 1 })
      .catch(() => ({ docs: [] as Array<{ id: number; slug: string; title: string; excerpt: string | null; published_at: string | null }> }))
    const founderSectors = await payload.find({
      collection: 'business-sectors',
      where: { mor_code: { in: FOUNDER_SECTOR_CODES } },
      limit: FOUNDER_SECTOR_CODES.length,
      depth: 0,
    })
    return {
      categories: categories.docs,
      counts,
      featured: featured.docs,
      totalSectors: sectorTotal.totalDocs,
      blogPosts: blogPosts.docs,
      founderSectors: founderSectors.docs,
    }
  })

  const totalSectors = data?.totalSectors ?? 519
  const categories = data?.categories ?? []
  const featured = data?.featured ?? []
  const counts = data?.counts ?? []
  const blogPosts = data?.blogPosts ?? []
  const founderSectors = (data?.founderSectors ?? []).sort(
    (a, b) => FOUNDER_SECTOR_CODES.indexOf(a.mor_code) - FOUNDER_SECTOR_CODES.indexOf(b.mor_code),
  )

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="brand" className="mb-6 inline-flex">
              <Sparkles className="h-3 w-3" /> {totalSectors} sectors · MOR Directive 17/2011
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-crisp text-ink sm:text-6xl lg:text-7xl">
              Open a business in Ethiopia.{' '}
              <span className="text-ink-muted">No middlemen.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-ink-muted sm:text-lg lg:text-xl">
              519 official sectors. Real fees, real timelines, and the ministry that actually
              approves your licence — for Bishoftu, Oromia, and federal Ethiopia.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/sectors">
                  Browse {totalSectors} sectors <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <Link href="/wizard">
                  Find my sector <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quiet partner marquee — social proof, no big rectangles */}
          <div className="mx-auto mt-16 max-w-5xl">
            <p className="mb-4 text-center text-2xs uppercase tracking-wider text-ink-faint">
              Local partners
            </p>
            <PartnersLogoBar />
          </div>
        </div>
      </section>

      {/* FOR FOUNDERS — design + software focus */}
      {founderSectors.length > 0 ? (
        <section className="border-b border-border bg-surface/40">
          <div className="container-page py-14 sm:py-20">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand">
                  <Code2 className="h-3.5 w-3.5" /> For founders
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
                  Opening a design or software company?
                </h2>
                <p className="mt-3 text-pretty text-ink-muted">
                  This is the most-asked question we get. Start with the sector code that
                  actually applies, the ministry that issues the licence, and the fees you&apos;ll
                  actually pay — no middlemen, no guesswork.
                </p>
              </div>
              <Link href="/consult" className="text-sm font-medium text-brand hover:underline self-start sm:self-end">
                Talk it through →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {founderSectors.map((s) => (
                <Link
                  key={s.id}
                  href={`/sectors/${s.slug}`}
                  className="group rounded-lg border border-border bg-bg p-5 transition-all hover:border-brand/40 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="mono">{s.mor_code}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold tracking-tightish text-ink group-hover:text-brand">
                    {s.name_en}
                  </h3>
                  {s.name_am ? (
                    <p className="mt-0.5 truncate font-amharic text-xs text-ink-faint">{s.name_am}</p>
                  ) : null}
                  {s.description_short ? (
                    <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{s.description_short}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* STATS */}
      <section className="border-b border-border">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Official sectors"
              value={totalSectors.toLocaleString()}
              hint="MOR Directive 17/2011, Annex 1"
              visual={<Sparkline data={[12, 24, 48, 90, 144, 234, 360, 519]} color={1} />}
            />
            <StatCard
              label="Top-level categories"
              value="9"
              hint="From agriculture to community services"
            />
            <StatCard
              label="Local partners"
              value="6"
              hint="Hospitality · logistics · IT · legal · accounting · marketing"
            />
            <StatCard
              label="City focus"
              value="Bishoftu"
              hint={
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Oromia · expanding from 2026
                </span>
              }
            />
          </div>
        </div>
      </section>

      {/* CHARTS — the cool visual layer */}
      <section className="border-b border-border bg-surface/50">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-brand">By the numbers</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              How {totalSectors} sectors break down — and where the growth is going
            </h2>
            <p className="mt-3 text-pretty text-ink-muted">
              The MOR directive splits every licensable activity in Ethiopia into 9 categories.
              Here&apos;s the distribution + a projection of where the next 6 years of new-business
              registrations are heading in Bishoftu.
            </p>
          </div>
          <HomeCharts categories={counts} />
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-brand">Browse by sector</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
                Pick a category. Drill down.
              </h2>
            </div>
            <Link href="/sectors" className="text-sm font-medium text-brand hover:underline self-start sm:self-end">
              All sectors →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = counts.find((x) => x.id === c.id)?.total ?? 0
              return (
                <Link
                  key={c.id}
                  href={`/sectors?category=${c.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all hover:border-brand/40 hover:bg-surface-2"
                >
                  <GeometricIcon slug={c.slug} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink group-hover:text-brand">{c.name_en}</p>
                    {c.name_am ? (
                      <p className="truncate font-amharic text-xs text-ink-faint">{c.name_am}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-ink">{count}</p>
                    <p className="text-2xs uppercase tracking-wider text-ink-faint">sectors</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-brand">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              Research, run, get intros. In that order.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <HowStep
              num="01"
              title="Read the sector guide"
              body="Every sector page has the MOR code, the licensing ministry, the certificates you'll need, and the approval chain. Free to browse — no signup, no paywall."
            />
            <HowStep
              num="02"
              title="Follow the process"
              body="Built from MOR Directive 17/2011 and four years of Bishoftu fieldwork. Most operators finish in 4–8 weeks. Use the wizard if you're not sure which sector to pick."
            />
            <HowStep
              num="03"
              title="Book a consult when you're stuck"
              body="Sector selection, business model sanity check, warm intros to our partner network (IT, legal, accounting, logistics). One-off, no subscription."
            />
          </div>
        </div>
      </section>

      {/* FEATURED SECTORS */}
      {featured.length > 0 ? (
        <section className="border-b border-border">
          <div className="container-page py-16 sm:py-20">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand">Editor&apos;s pick</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
                  Sectors worth a look right now
                </h2>
              </div>
              <Link href="/sectors" className="text-sm font-medium text-brand hover:underline self-start sm:self-end">
                Browse all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <Link
                  key={s.id}
                  href={`/sectors/${s.slug}`}
                  className="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-brand/40 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="mono">{s.mor_code}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold tracking-tightish text-ink group-hover:text-brand">
                    {s.name_en}
                  </h3>
                  {s.name_am ? (
                    <p className="mt-0.5 truncate font-amharic text-xs text-ink-faint">{s.name_am}</p>
                  ) : null}
                  {s.description_short ? (
                    <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{s.description_short}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* BLOG FEATURED */}
      <section className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-brand">Writing</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
                Notes from the field
              </h2>
              <p className="mt-2 max-w-xl text-pretty text-ink-muted">
                Long-form on the Bishoftu economy, the airport build, and the boring-but-critical
                bits of opening a business in Ethiopia.
              </p>
            </div>
            <Link href="/blog" className="text-sm font-medium text-brand hover:underline self-start sm:self-end">
              All writing →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(blogPosts.length > 0 ? blogPosts : MOCK_BLOG).map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-brand/40 hover:shadow-glow"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-brand-muted via-surface-2 to-surface" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {p.published_at ? (
                    <p className="text-2xs uppercase tracking-wider text-ink-faint">
                      {new Date(p.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  ) : null}
                  <h3 className="text-lg font-semibold tracking-tightish text-ink group-hover:text-brand">
                    {p.title}
                  </h3>
                  {p.excerpt ? (
                    <p className="line-clamp-3 text-sm text-ink-muted">{p.excerpt}</p>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-brand pt-2">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BISHOFTU CALLOUT */}
      <section className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <Card className="relative overflow-hidden p-7 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="brand" className="mb-4 inline-flex">
                  <MapPin className="h-3 w-3" /> Bishoftu / Debrezeit
                </Badge>
                <h3 className="text-balance text-3xl font-semibold tracking-tightish sm:text-4xl">
                  The city we know cold.
                </h3>
                <p className="mt-4 text-pretty text-ink-muted">
                  Bishoftu is where the next decade of Ethiopian growth lands. $12.5B airport
                  build (2026–2030), 245k population, 3.2% YoY growth, five lakes, and a tourism /
                  F&amp;B / logistics economy reshaping itself in real time.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    Live indicators: population, FX, sector trends
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    Airport phase timeline + sector impact projections
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    Top 10 opportunities scored by readiness window
                  </li>
                </ul>
                <div className="mt-8 flex gap-3">
                  <Button asChild>
                    <Link href="/bishoftu">
                      Open Bishoftu Pulse <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div
                className="relative h-64 sm:h-72 rounded-md border border-border overflow-hidden"
                aria-hidden
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand-strong/15" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.5) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6 sm:px-8">
                  <p className="font-mono text-2xs uppercase tracking-wider text-ink-faint">
                    Bishoftu Pulse · 2026
                  </p>
                  <p className="text-4xl sm:text-5xl font-semibold tracking-crisp text-ink">$12.5B</p>
                  <p className="text-sm text-ink-muted">
                    Airport investment · 6,000 ha · 100M passenger capacity
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="container-page py-16 sm:py-24 text-center">
          <Badge variant="brand" className="mb-5 inline-flex">
            <Handshake className="h-3 w-3" /> Ready when you are
          </Badge>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tightish sm:text-4xl lg:text-5xl">
            Have a business idea? Let&apos;s talk it through.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            The guides are free. If you want a second pair of eyes on your sector, entity type,
            or approval chain — book a one-off consult. No subscription, no upsell ladder.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consult">
                Book a consult <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <a href={CONSULT_TELEGRAM} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> Message on Telegram
              </a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-ink-faint">
            Bishoftu · Oromia · Federal Ethiopia · Replies in a day or two
          </p>
        </div>
      </section>
    </div>
  )
}

function HowStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg/50 p-6 sm:p-7">
      <p className="font-mono text-xs tracking-widest text-brand">{num}</p>
      <h3 className="mt-3 text-lg font-semibold tracking-tightish text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  )
}

const MOCK_BLOG = [
  {
    id: 'mock-1',
    slug: 'opening-a-cafe-in-bishoftu',
    title: 'Opening a cafe in Bishoftu: the actual 8-week timeline',
    excerpt:
      'From TIN to first espresso pull — every office visit, every form, every queue. The version nobody publishes.',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'mock-2',
    slug: 'airport-build-impact',
    title: 'How the $12.5B Bishoftu airport will reshape five sectors',
    excerpt:
      'Tourism, F&B, logistics, construction supply, and last-mile delivery. The capital window closes by 2027.',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
  },
  {
    id: 'mock-3',
    slug: 'mor-17-2011-explained',
    title: 'MOR Directive 17/2011, explained for first-time operators',
    excerpt:
      'The 519-sector code system. Which categories matter, which are decorative, and how to read the 5-digit codes.',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
  },
] as Array<{ id: string; slug: string; title: string; excerpt: string; published_at: string }>
