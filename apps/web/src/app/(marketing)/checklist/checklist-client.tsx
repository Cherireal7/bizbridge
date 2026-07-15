'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Clock, Landmark, Printer, RotateCcw, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Chart } from '@/components/charts/chart'
import { cn } from '@/lib/cn'
import { humanizeSectorName } from '@/lib/humanize-sector-name'

interface SectorHit {
  id: string | number
  slug: string
  mor_code: string
  name_en: string
}

interface Step {
  id: string
  title: string
  description: string
  where_to_go: string
  estimated_days: number
}

const TEMPLATE: Step[] = [
  {
    id: 'investment-licence',
    title: 'Investment licence',
    description:
      'Apply at the Ethiopian Investment Commission (EIC). Bring passport / national ID, business plan, and project description.',
    where_to_go: 'Ethiopian Investment Commission (EIC), Addis',
    estimated_days: 5,
  },
  {
    id: 'tin',
    title: 'TIN registration',
    description:
      'Get your Tax Identification Number from the Ministry of Revenue branch nearest your business address.',
    where_to_go: 'Bishoftu Tax Authority Branch',
    estimated_days: 1,
  },
  {
    id: 'bank-account',
    title: 'Open business bank account',
    description:
      'Choose a private bank (CBE for diaspora foreign-currency accounts). Deposit minimum capital per business type.',
    where_to_go: 'Any commercial bank',
    estimated_days: 2,
  },
  {
    id: 'trade-licence',
    title: 'Trade licence',
    description:
      'Apply at the Regional Trade Bureau / Bishoftu City Trade Office with the correct MOR sector code.',
    where_to_go: 'Bishoftu City Trade Office',
    estimated_days: 3,
  },
  {
    id: 'sector-approval',
    title: 'Sector-specific ministry approval',
    description:
      'Depends on the sector — health, food, transport, etc. each need a separate competency / approval check.',
    where_to_go: 'Sector ministry (see your sector page)',
    estimated_days: 10,
  },
  {
    id: 'employer-id',
    title: 'Employer registration',
    description:
      'Register with Social Security (POESSA) and the Ministry of Labour if hiring employees.',
    where_to_go: 'POESSA / Labour Office',
    estimated_days: 2,
  },
  {
    id: 'lease',
    title: 'Lease / land agreement',
    description:
      'Sign a notarized lease or, for industrial land, work with EIDC for plot allocation. Required for the trade licence.',
    where_to_go: 'Local sub-city / EIDC',
    estimated_days: 7,
  },
  {
    id: 'vat',
    title: 'VAT registration (if applicable)',
    description:
      'Annual turnover ≥ ETB 1M triggers VAT. Register at MOR and obtain VAT certificate.',
    where_to_go: 'Ministry of Revenue',
    estimated_days: 2,
  },
]

const STORAGE_PREFIX = 'bb.checklist.'

interface SavedState {
  completed: Record<string, boolean>
  notes: Record<string, string>
  sectorSlug?: string | null
}

export function ChecklistClient({ initialSectorSlug }: { initialSectorSlug: string | null }) {
  const [sector, setSector] = useState<SectorHit | null>(null)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [celebrate, setCelebrate] = useState(false)

  const storageKey = STORAGE_PREFIX + (initialSectorSlug ?? 'general')

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedState
        setCompleted(parsed.completed ?? {})
        setNotes(parsed.notes ?? {})
      } catch {
        /* noop */
      }
    }
  }, [storageKey])

  useEffect(() => {
    const state: SavedState = { completed, notes, sectorSlug: initialSectorSlug }
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [completed, notes, initialSectorSlug, storageKey])

  // Load sector
  useEffect(() => {
    if (!initialSectorSlug) return
    const params = new URLSearchParams()
    params.set('where[slug][equals]', initialSectorSlug)
    params.set('limit', '1')
    params.set('depth', '0')
    fetch(`/api/business-sectors?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSector(d.docs?.[0] ?? null))
      .catch(() => {})
  }, [initialSectorSlug])

  const doneCount = Object.values(completed).filter(Boolean).length
  const progress = Math.round((doneCount / TEMPLATE.length) * 100)
  const totalDays = TEMPLATE.reduce(
    (acc, s) => (completed[s.id] ? acc : acc + s.estimated_days),
    0,
  )

  // Confetti on full completion
  useEffect(() => {
    if (doneCount === TEMPLATE.length && doneCount > 0) {
      setCelebrate(true)
      toast.success('All steps complete — congratulations!')
      const t = setTimeout(() => setCelebrate(false), 3000)
      return () => clearTimeout(t)
    }
  }, [doneCount])

  const reset = () => {
    setCompleted({})
    setNotes({})
    toast.message('Checklist reset')
  }

  const toggle = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* STEPS */}
      <div className="space-y-3">
        {sector ? (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Badge variant="mono">MOR {sector.mor_code}</Badge>
              <p className="text-sm font-medium leading-snug text-ink">
                {humanizeSectorName(sector.mor_code, sector.name_en)}
              </p>
            </div>
          </Card>
        ) : null}

        {TEMPLATE.map((s, i) => {
          const done = !!completed[s.id]
          return (
            <Card
              key={s.id}
              className={cn(
                'p-5 transition-all',
                done && 'opacity-60',
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggle(s.id)}
                  aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                  className={cn(
                    'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all',
                    done
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-border bg-surface text-transparent hover:border-brand/40',
                  )}
                >
                  <Check className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                    <h3
                      className={cn(
                        'text-base font-semibold tracking-tightish text-ink',
                        done && 'line-through',
                      )}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <p className={cn('mt-1 text-sm text-ink-muted', done && 'line-through')}>
                    {s.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                    <span className="inline-flex items-center gap-1">
                      <Landmark className="h-3 w-3" /> {s.where_to_go}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{s.estimated_days} days
                    </span>
                  </div>
                  <textarea
                    value={notes[s.id] ?? ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="Add a note — appointment date, contact name, missing document…"
                    className="mt-3 w-full resize-none rounded-md border border-border bg-bg/40 px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none"
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* PROGRESS */}
      <div className="space-y-4">
        <Card className="relative overflow-hidden p-6">
          {celebrate ? <Celebration /> : null}
          <p className="text-xs uppercase tracking-wider text-brand">Progress</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-4xl font-semibold tracking-crisp text-ink">{progress}%</p>
            <p className="text-sm text-ink-muted">
              {doneCount} / {TEMPLATE.length}
            </p>
          </div>
          <Chart
            type="radialBar"
            height={220}
            series={[progress]}
            options={{
              chart: { sparkline: { enabled: true } },
              plotOptions: {
                radialBar: {
                  hollow: { size: '60%' },
                  track: { background: 'rgb(var(--surface-3))' },
                  dataLabels: {
                    name: { show: false },
                    value: {
                      show: true,
                      fontSize: '20px',
                      fontWeight: 600,
                      color: 'rgb(var(--ink))',
                      formatter: (v: number) => `${v}%`,
                    },
                  },
                },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  type: 'horizontal',
                  gradientToColors: ['rgb(var(--accent))'],
                },
              },
              stroke: { lineCap: 'round' },
            }}
          />
          <p className="mt-2 text-center text-xs text-ink-muted">
            ~{totalDays} days remaining at current pace
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-ink">Save progress anywhere</p>
          <p className="mt-1 text-xs text-ink-muted">
            Saved to this browser. Sign in to sync across devices and get reminder emails.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print / save PDF
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset checklist
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Celebration() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="relative h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x = Math.cos(angle) * 80
          const y = Math.sin(angle) * 80
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 inline-flex h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: i % 2 ? 'rgb(var(--brand))' : 'rgb(var(--accent))',
                transform: `translate(${x}px, ${y}px) scale(0.5)`,
                opacity: 0.8,
                animation: `fade-in 600ms ease-out`,
              }}
            />
          )
        })}
        <Sparkles className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-scale-in text-accent" />
      </div>
    </div>
  )
}
