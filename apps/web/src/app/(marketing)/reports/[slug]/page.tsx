import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Download, FileText } from 'lucide-react'
import { tryPayload } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const revalidate = 600
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const data = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'reports',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 0,
    })
    return r.docs.map((p) => ({ slug: p.slug }))
  })
  return data ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const report = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'reports',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
    })
    return r.docs[0] ?? null
  })
  if (!report) return { title: 'Report not found' }
  return { title: report.title, description: report.description ?? undefined }
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { slug } = await params
  const report = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'reports',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    })
    return r.docs[0] ?? null
  })

  if (!report) notFound()

  return (
    <article>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10 sm:py-14">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs text-ink-faint hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All reports
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">Research report</Badge>
                {typeof report.sector === 'object' && report.sector ? (
                  <Badge variant="mono">MOR {report.sector.mor_code}</Badge>
                ) : null}
              </div>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-crisp sm:text-4xl lg:text-5xl">
                {report.title}
              </h1>
              {report.description ? (
                <p className="mt-4 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
                  {report.description}
                </p>
              ) : null}
            </div>

            <Card className="p-6 lg:sticky lg:top-24 h-fit">
              <p className="text-xs uppercase tracking-wider text-brand">Price</p>
              <p className="mt-2 text-4xl font-semibold tracking-crisp">
                ${typeof report.price_usd === 'number' ? report.price_usd : 0}
                <span className="ml-2 text-sm font-normal text-ink-faint">USD</span>
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                or ETB {(typeof report.price_birr === 'number' ? report.price_birr : 0).toLocaleString()}
                {' '}· one-time
              </p>

              <div className="mt-6 space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/checkout?type=report&slug=${report.slug}`}>
                    Buy report
                  </Link>
                </Button>
                {report.preview ? (
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="#preview">
                      <Download className="h-4 w-4" /> Free preview
                    </Link>
                  </Button>
                ) : null}
              </div>

              <ul className="mt-6 space-y-2 text-xs text-ink-muted">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> Pay once · lifetime download
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> Chapa · TeleBirr · Remitly
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> 14-day data-accuracy refund
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8 text-pretty text-ink-muted leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold tracking-tightish text-ink">What&apos;s inside</h2>
              <p className="mt-3">
                {report.description ?? 'Full report contents and table of contents render here once the report body is authored in the Payload admin.'}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tightish text-ink">Methodology</h2>
              <p className="mt-3">
                Mixed-method: directive analysis (MOR 17/2011), field interviews in Bishoftu,
                cross-referenced with etrade.gov.et data and ministry public schedules. All numbers
                are cited inline; the bibliography is included.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tightish text-ink">Who this is for</h2>
              <ul className="mt-3 space-y-2">
                <li>· First-time founders deciding whether this sector fits their capital</li>
                <li>· Operators sizing an expansion into Ethiopia</li>
                <li>· Consultants briefing clients on Bishoftu / Oromia opportunities</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Format</p>
              <p className="mt-2 text-sm text-ink-muted">
                Delivered as a PDF + raw CSV data appendix where applicable. Average length:
                25–60 pages.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Updates</p>
              <p className="mt-2 text-sm text-ink-muted">
                Reports refresh annually. Buyers get the new edition free for 12 months.
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </article>
  )
}
