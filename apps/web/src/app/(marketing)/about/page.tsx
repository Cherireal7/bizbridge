import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'

export const metadata: Metadata = {
  title: 'About',
  description:
    'BizBridge Ethiopia is a personal project — survey research and a clear process for opening a business in Bishoftu, applicable across Oromia and Ethiopia.',
}

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            About
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            A personal project.{' '}
            <span className="text-ink-muted">Bishoftu-specialized. Oromia-aware. Ethiopia-applicable.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            BizBridge is not a company. It&apos;s a personal project built around what
            I&apos;ve learned opening businesses and watching others try in Bishoftu. The goal:
            give entrepreneurs, diaspora investors, and curious operators the research and the
            real process they need — without the middlemen.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10 text-pretty text-ink-muted">
            <Block title="What this is">
              <p>
                A digital research product. We sell survey data and a step-by-step process for
                opening a licensable business in Ethiopia — drawn from MOR Directive 17/2011 plus
                a few years of field research in Bishoftu / Debrezeit.
              </p>
            </Block>
            <Block title="What this is not (and how we still help)">
              <p>
                We don&apos;t run your registration for you. You do the steps — that&apos;s the
                point. But you&apos;re not on your own. We&apos;ve assembled a small network of
                vetted Bishoftu / Oromia operators who handle the pieces you shouldn&apos;t do
                alone: legal &amp; commercial registration, accounting / tax, IT setup, last-mile
                logistics, and hospitality service partners.
              </p>
              <p className="mt-3">
                Pro members get warm introductions to that network plus a 30-minute call with our
                business lawyer to sanity-check the idea and the model.
              </p>
            </Block>
            <Block title="Why Bishoftu">
              <p>
                Because that&apos;s where I&apos;ve done the most work — and because the next
                decade of Ethiopian growth is concentrated there. A $12.5B airport build, 245k
                people, 3.2% YoY growth, five lakes, tourism + F&amp;B + logistics economies all
                reshaping in real time. The sector data is national; the field detail is local.
              </p>
            </Block>
            <Block title="Why I built this">
              <p>
                Because middlemen quote $1,500 to do what a focused entrepreneur can do for
                $200 in fees and a few weeks of patience. The information asymmetry shouldn&apos;t
                cost you a thousand dollars. So I priced the research at $29–$149 one-time, no
                subscriptions, no claw-backs.
              </p>
            </Block>
            <Block title="What you get when you pay">
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  Every sector code with the official ministry and licence office
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  Fees and timelines (verified where possible, flagged where estimated)
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  A step-by-step process that orders the moves correctly
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  Bishoftu-specific notes where the city differs from Addis defaults
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  Pro: a 30-min call with a lawyer + warm intros to vetted operational partners
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">·</span>
                  Email guidance — quick questions answered, always
                </li>
              </ul>
            </Block>
          </div>

          <aside className="space-y-4">
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Quick facts</p>
              <div className="mt-3 space-y-3 text-sm text-ink-muted">
                <Fact label="Project type" value="Personal · not a company" />
                <Fact label="Scope" value="Survey research + process guide" />
                <Fact label="Specialty" value="Bishoftu / Debrezeit, Oromia" />
                <Fact label="Coverage" value="All 519 MOR sectors, federal Ethiopia" />
                <Fact label="Pricing" value="One-time · no subscriptions" />
                <Fact label="Payments" value="Chapa · TeleBirr · Remitly" />
                <Fact label="What we don't do" value="Run registrations directly" />
                <Fact label="What we do" value="Research, process, warm intros" />
                <Fact label="Languages" value="EN · AM (gradually)" />
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Get in touch</p>
              <p className="mt-2 text-sm text-ink-muted">
                Questions about your situation, the data, or whether BizBridge is right for you?
                Email is the fastest way to reach me.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="mailto:hello@bizbridge.et">
                  <Mail className="h-4 w-4" />
                  hello@bizbridge.et
                </Link>
              </Button>
              <Button asChild variant="secondary" className="mt-2 w-full">
                <Link href="/lawyer">
                  Pro: talk to a lawyer <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-brand">Where I am</p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-ink">
                <MapPin className="h-4 w-4 text-brand" /> Bishoftu, Oromia
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                45 km from Addis Ababa · GMT+3
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tightish text-ink">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-ink-faint">{label}</span>
      <span className="text-right text-ink">{value}</span>
    </div>
  )
}
