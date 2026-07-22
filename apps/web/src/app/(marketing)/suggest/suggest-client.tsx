'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

type Sector = {
  mor_code: string
  name_en: string
  name_am: string | null
  slug: string
  description_short: string | null
}

type Tier = {
  key: string
  min_usd: number
  max_usd: number
  label: string
  headline: string
  vibe: string
  sectors: Sector[]
}

const ETB_PER_USD = 55 // approximate — client-side only, this is not fx-accurate

function tierForUsd(amount: number, tiers: Tier[]): Tier {
  for (const t of tiers) {
    if (amount >= t.min_usd && amount < t.max_usd) return t
  }
  return tiers[tiers.length - 1]!
}

function formatUsd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
function formatEtb(n: number) {
  return `ETB ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

const PRESETS = [
  { label: '$5k', usd: 5_000 },
  { label: '$25k', usd: 25_000 },
  { label: '$100k', usd: 100_000 },
  { label: '$250k', usd: 250_000 },
  { label: '$1M', usd: 1_000_000 },
]

export function SuggestClient({ tiers }: { tiers: Tier[] }) {
  const [amountUsd, setAmountUsd] = useState<number>(25_000)
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('USD')

  const tier = useMemo(() => tierForUsd(amountUsd, tiers), [amountUsd, tiers])
  const displayAmount = currency === 'USD' ? amountUsd : amountUsd * ETB_PER_USD

  return (
    <section className="container-page pt-12 pb-14 sm:pt-16">
      {/* INPUT PANEL */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              your capital
            </p>
            <p className="mt-2 text-4xl font-semibold tracking-crisp text-ink sm:text-5xl">
              {currency === 'USD' ? formatUsd(displayAmount) : formatEtb(displayAmount)}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {currency === 'USD'
                ? `≈ ${formatEtb(amountUsd * ETB_PER_USD)}`
                : `≈ ${formatUsd(amountUsd)}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                currency === 'USD'
                  ? 'border-brand/60 bg-brand/10 text-ink'
                  : 'border-border/70 bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('ETB')}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                currency === 'ETB'
                  ? 'border-brand/60 bg-brand/10 text-ink'
                  : 'border-border/70 bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              ETB
            </button>
          </div>
        </div>

        <div className="mt-6">
          <input
            type="range"
            min="1000"
            max="5000000"
            step="1000"
            value={amountUsd}
            onChange={(e) => setAmountUsd(Number(e.target.value))}
            className="w-full accent-brand"
            aria-label="Starting capital in USD"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <span>$1k</span>
            <span>$5M+</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.usd}
              type="button"
              onClick={() => setAmountUsd(p.usd)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                amountUsd === p.usd
                  ? 'border-brand/60 bg-brand/10 text-ink'
                  : 'border-border/70 bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      {/* TIER SUMMARY */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Badge variant="accent">{tier.label} tier</Badge>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          {formatUsd(tier.min_usd)}{tier.max_usd < 5_000_000 ? ` – ${formatUsd(tier.max_usd)}` : '+'}
        </p>
      </div>
      <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tightish sm:text-3xl">
        {tier.headline}
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-ink-muted">{tier.vibe}</p>

      {/* SECTOR RESULTS */}
      {tier.sectors.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border/70 bg-surface/40 p-6 font-mono text-[12px] text-ink-muted">
          No suggested sectors seeded for this tier yet. Try adjusting the amount.
        </p>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tier.sectors.map((s) => (
            <Link
              key={s.mor_code}
              href={`/sectors/${s.slug}`}
              className="group rounded-xl border border-border/70 bg-surface p-5 transition-all hover:border-brand/40 hover:bg-surface-2"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge variant="mono">{s.mor_code}</Badge>
                <ArrowUpRight className="h-4 w-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <p className="mt-3 text-base font-semibold leading-snug text-ink group-hover:text-brand">
                {s.name_en}
              </p>
              {s.name_am ? (
                <p className="mt-0.5 truncate font-amharic text-xs text-ink-faint">
                  {s.name_am}
                </p>
              ) : null}
              {s.description_short ? (
                <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{s.description_short}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
