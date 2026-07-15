import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'

export const metadata: Metadata = {
  title: 'Research reports',
  description:
    'Purchase Bishoftu-focused business research reports. Survey data, sector deep-dives, opportunity analysis — pay once, download forever.',
}

export const revalidate = 600

export default async function ReportsCatalogPage() {
  const data = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'reports',
      where: { _status: { equals: 'published' } },
      limit: 50,
      sort: '-createdAt',
      depth: 1,
    })
    return r.docs
  })

  const reports = data ?? []

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            Research catalog
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Reports built on real fieldwork.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            Sector deep-dives, opportunity analyses, and Bishoftu market data — published as
            standalone reports. Pay once. Download forever. Standard subscribers get 3 included;
            Pro subscribers get the lot.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-brand/15 text-brand">
              <FileText className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-medium text-ink">No reports published yet</p>
            <p className="mt-1 text-sm text-ink-muted">
              The research pipeline lives in the Payload admin. First reports ship soon.
            </p>
            <Button asChild className="mt-6">
              <Link href="/bishoftu">
                Preview the data <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Link
                key={r.id}
                href={`/reports/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-brand/40 hover:shadow-glow"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-brand-muted via-surface-2 to-surface">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgb(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.5) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="absolute inset-0 flex items-end justify-between p-4">
                    <Badge variant="mono">REPORT</Badge>
                    {typeof r.sector === 'object' && r.sector ? (
                      <span className="font-mono text-2xs text-ink-faint">
                        MOR {r.sector.mor_code}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-base font-semibold tracking-tightish text-ink group-hover:text-brand">
                    {r.title}
                  </h3>
                  {r.description ? (
                    <p className="line-clamp-3 text-sm text-ink-muted">{r.description}</p>
                  ) : null}
                  <div className="mt-auto flex items-baseline justify-between pt-3 border-t border-border">
                    <p className="text-lg font-semibold tracking-tightish">
                      ${typeof r.price_usd === 'number' ? r.price_usd : 0}
                      <span className="ml-1.5 text-xs font-normal text-ink-faint">USD</span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-page py-12 sm:py-16">
          <Card className="relative overflow-hidden p-7 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand">Custom research</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tightish">
                  Need something a published report doesn&apos;t cover?
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Tell us what you&apos;re trying to figure out — sector deep-dive, location
                  analysis, feasibility check. We&apos;ll say if we can help and how.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/consult">
                  Book a consult <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
