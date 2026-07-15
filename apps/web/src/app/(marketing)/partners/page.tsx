import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Handshake, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { PartnerCard } from '@/components/marketing/partner-card'
import { PARTNERS, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/partners'

export const metadata: Metadata = {
  title: 'Trusted partners · Bishoftu',
  description:
    'Vetted local partners we send BizBridge customers to — hospitality, logistics, IT, legal, accounting, marketing. Featuring Doxa Classic Restaurant and Feeder Delivery.',
}

export default function PartnersPage() {
  const featured = PARTNERS.filter((p) => p.featured)
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    partners: PARTNERS.filter((p) => p.category === cat),
  })).filter((g) => g.partners.length > 0)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            <Handshake className="h-3 w-3" /> Trusted partners
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Local operators we send our customers to.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            BizBridge is research and process — but when you need someone to <em>do</em>{' '}
            something specific (launch your menu, set up your software, register your entity,
            handle your books), we connect you with vetted Bishoftu / Oromia operators we know
            personally.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/pricing">
                Get Pro for warm intros <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="mailto:hello@bizbridge.et?subject=Become a BizBridge partner">
                <Mail className="h-4 w-4" /> Become a partner
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="container-page py-12 sm:py-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-brand">Featured</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tightish">
              Working partners we recommend by name
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((p) => (
              <PartnerCard key={p.slug} partner={p} category={CATEGORY_LABELS[p.category]} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page py-8 sm:py-12">
        <div className="space-y-12">
          {grouped.map((group) => (
            <section key={group.category}>
              <header className="mb-5 flex items-end justify-between gap-3 border-b border-border pb-3">
                <h2 className="text-xl font-semibold tracking-tightish">{group.label}</h2>
                <span className="font-mono text-xs text-ink-faint">
                  {group.partners.length} partner{group.partners.length === 1 ? '' : 's'}
                </span>
              </header>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.partners.map((p) => (
                  <PartnerCard
                    key={p.slug}
                    partner={p}
                    category={CATEGORY_LABELS[p.category]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Card className="relative overflow-hidden p-7 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand">How introductions work</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tightish">
                  Buy Pro. Tell us what you need. We make the intro.
                </h3>
                <p className="mt-3 text-pretty text-ink-muted">
                  Pro members ($149 one-time) get warm introductions to partners on this list.
                  We share your project brief with the right operator, copy you on the
                  introduction email, and let you take it from there. No commission, no markup —
                  just the connection.
                </p>
                <ol className="mt-5 grid gap-2 text-sm text-ink-muted sm:grid-cols-3">
                  <li className="rounded-md border border-border bg-bg/40 p-3">
                    <span className="font-mono text-xs text-brand">01</span>
                    <p className="mt-1 text-ink">Upgrade to Pro</p>
                  </li>
                  <li className="rounded-md border border-border bg-bg/40 p-3">
                    <span className="font-mono text-xs text-brand">02</span>
                    <p className="mt-1 text-ink">Email what you need</p>
                  </li>
                  <li className="rounded-md border border-border bg-bg/40 p-3">
                    <span className="font-mono text-xs text-brand">03</span>
                    <p className="mt-1 text-ink">Get introduced</p>
                  </li>
                </ol>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/pricing">
                    See Pro pricing <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="mailto:hello@bizbridge.et">Email a question</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
