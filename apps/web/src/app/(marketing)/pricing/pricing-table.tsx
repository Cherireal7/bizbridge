'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/components/providers/currency-provider'
import { cn } from '@/lib/cn'

interface PricingTableProps {
  prices: {
    standard: { usd: number; etb: number }
    pro: { usd: number; etb: number }
  }
}

export function PricingTable({ prices }: PricingTableProps) {
  const { currency, format } = useCurrency()

  const formatTier = (p: { usd: number; etb: number }) =>
    currency === 'USD' ? format(p.usd) : `ETB ${p.etb.toLocaleString()}`

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="grid gap-4 md:grid-cols-3">
        <Plan
          name="Free"
          tagline="Start here"
          priceLabel={currency === 'USD' ? '$0' : 'ETB 0'}
          cycleLabel="forever"
          features={[
            'Browse all 519 sector overviews',
            'MOR code lookup tool',
            'Bishoftu Pulse public data',
            'Sector decision wizard',
            'First setup step per sector',
            'Blog and editorial writing',
          ]}
          cta={{ label: 'Create free account', href: '/signup' }}
        />
        <Plan
          name="Standard"
          tagline="The full guide"
          priceLabel={formatTier(prices.standard)}
          cycleLabel="one-time · lifetime"
          features={[
            'Everything in Free',
            'Full step-by-step process per sector',
            'Official fees + estimates (ETB + USD)',
            'All ministry approval chains',
            'Cost calculator with PDF export',
            'Synced personalized checklists',
            'Document templates',
            '3 survey research reports included',
          ]}
          cta={{ label: 'Get Standard', href: '/checkout?tier=standard' }}
          highlighted
        />
        <Plan
          name="Pro"
          tagline="Plus a lawyer in your corner"
          priceLabel={formatTier(prices.pro)}
          cycleLabel="one-time · lifetime"
          features={[
            'Everything in Standard',
            'All survey research reports included',
            'Bishoftu market research + raw data',
            '30-minute lawyer consultation slot',
            'Priority email guidance',
            'Idea + business model review notes',
          ]}
          cta={{ label: 'Get Pro', href: '/checkout?tier=pro' }}
        />
      </div>

      <p className="mt-10 text-center text-xs text-ink-faint">
        Prices shown in <span className="font-mono">{currency}</span>. Pay via Chapa · TeleBirr · or
        bank transfer (Remitly).
      </p>
    </section>
  )
}

interface PlanProps {
  name: string
  tagline: string
  priceLabel: string
  cycleLabel: string
  features: string[]
  cta: { label: string; href: string }
  highlighted?: boolean
}

function Plan({ name, tagline, priceLabel, cycleLabel, features, cta, highlighted }: PlanProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border bg-surface p-7 sm:p-8 transition-all',
        highlighted
          ? 'border-brand/50 shadow-glow before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-brand/5 before:to-transparent before:pointer-events-none'
          : 'border-border hover:border-brand/40',
      )}
    >
      {highlighted ? (
        <Badge variant="brand" className="absolute -top-2.5 left-7 sm:left-8">
          Recommended
        </Badge>
      ) : null}
      <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{name}</p>
      <p className="mt-1 text-sm text-ink-faint">{tagline}</p>
      <p className="mt-6 text-4xl font-semibold tracking-crisp text-ink">{priceLabel}</p>
      <p className="mt-1 text-xs text-ink-faint">{cycleLabel}</p>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-ink-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={highlighted ? 'primary' : 'secondary'}
        className="mt-8 w-full"
      >
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  )
}
