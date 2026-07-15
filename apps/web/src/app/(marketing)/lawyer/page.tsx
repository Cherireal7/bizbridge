import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Check, Lock, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { getCurrentUserTier } from '@/lib/auth-server'

export const metadata: Metadata = {
  title: 'Talk to a lawyer · Pro tier',
  description:
    '30-minute consultation with a verified Ethiopian business lawyer. Business idea, business model, sector selection, registration questions. Pro tier benefit.',
}

export default async function LawyerPage() {
  const tier = await getCurrentUserTier()
  const hasPro = tier === 'pro'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            Pro tier benefit
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Talk to a lawyer{' '}
            <span className="text-ink-muted">about your idea, before you register.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted">
            One 30-minute call with a verified Ethiopian business lawyer. Sanity-check your
            business idea, structure your model, pick the right entity type, and avoid the
            rookie mistakes that cost you a month and a refile fee.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {hasPro ? (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard?book=lawyer">
                  Book your call <Calendar className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/pricing">
                    Upgrade to Pro · $149 <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Link href="mailto:hello@bizbridge.et">
                    Email a question first <Mail className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Topic
            icon={MessageSquare}
            title="Business idea sanity check"
            body="Will this work in Bishoftu? Is the local market deep enough? What's the realistic addressable demand for the first year?"
          />
          <Topic
            icon={ShieldCheck}
            title="Business model structure"
            body="Revenue lines, pricing, unit economics, customer acquisition. The lawyer reviews the model before you commit to a registration."
          />
          <Topic
            icon={Check}
            title="Entity type selection"
            body="Sole proprietorship vs PLC vs share company vs foreign branch. Tax implications, capital requirements, and which one fits your situation."
          />
          <Topic
            icon={ShieldCheck}
            title="Sector + licence questions"
            body="Which MOR sector code best fits your activity? What ministry approvals will you need? Where do common applications get stuck?"
          />
          <Topic
            icon={MessageSquare}
            title="Rookie mistakes to avoid"
            body="The five things that send 70% of first-time applicants back to the trade office. Specific to your sector and entity type."
          />
          <Topic
            icon={Calendar}
            title="What to do this week"
            body="Concrete action items in priority order. Which document to gather first, who to call, what to bring to which appointment."
          />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-brand">What we don&apos;t do</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
                We won&apos;t register your business for you.
              </h2>
              <p className="mt-4 text-pretty text-ink-muted">
                That&apos;s your job — and it&apos;s good for you. You learn the system, you
                meet the offices, you carry the relationship forward. The lawyer is here to make
                sure you don&apos;t walk into a wall on day one. You walk in armed.
              </p>
              <p className="mt-3 text-sm text-ink-faint">
                If you want a turnkey registration service, that&apos;s a different product (and
                a different price point). BizBridge is research + guidance.
              </p>
            </div>
            <Card className="p-7 sm:p-8">
              <p className="text-xs uppercase tracking-wider text-brand">How the call works</p>
              <ol className="mt-4 space-y-3 text-sm text-ink-muted">
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 font-mono text-2xs text-brand">
                    1
                  </span>
                  <span>
                    Upgrade to Pro ($149 one-time, via Chapa / TeleBirr / Remitly).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 font-mono text-2xs text-brand">
                    2
                  </span>
                  <span>
                    Book your 30-min slot from the dashboard. You&apos;ll fill a short prep form
                    so the lawyer can review your situation before the call.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 font-mono text-2xs text-brand">
                    3
                  </span>
                  <span>
                    Take the call (English or Amharic). Get written notes within 24 hours.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 font-mono text-2xs text-brand">
                    4
                  </span>
                  <span>
                    Email follow-ups for clarification questions are included for 30 days.
                  </span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </section>

      {!hasPro ? (
        <section className="container-page py-12 sm:py-16">
          <Card className="relative overflow-hidden p-7 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
                  <Lock className="h-3.5 w-3.5" /> Pro tier only
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tightish">
                  Unlock the lawyer consultation
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Standard tier ($29) is data + process only. The 30-min call comes with Pro.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/pricing">
                  See pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>
      ) : null}
    </div>
  )
}

function Topic({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <Card className="p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand/15 text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tightish text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </Card>
  )
}
