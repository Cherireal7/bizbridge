'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, FileSearch, Lock, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Chart } from '@/components/charts/chart'
import { useCurrency } from '@/components/providers/currency-provider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type BusinessType = 'sole_proprietorship' | 'plc' | 'share_company' | 'branch'
type UserType = 'local' | 'diaspora' | 'foreign_investor'

interface SectorHit {
  id: string | number
  slug: string
  mor_code: string
  name_en: string
}

const BUSINESS_TYPES: { value: BusinessType; label: string; capitalFloor: number }[] = [
  { value: 'sole_proprietorship', label: 'Sole proprietorship', capitalFloor: 0 },
  { value: 'plc', label: 'PLC', capitalFloor: 50_000 },
  { value: 'share_company', label: 'Share company', capitalFloor: 500_000 },
  { value: 'branch', label: 'Foreign branch', capitalFloor: 200_000 },
]

const USER_TYPES: { value: UserType; label: string; mult: number }[] = [
  { value: 'local', label: 'Local', mult: 1 },
  { value: 'diaspora', label: 'Diaspora', mult: 1.15 },
  { value: 'foreign_investor', label: 'Foreign investor', mult: 1.4 },
]

export function CalculatorClient({ initialSectorSlug }: { initialSectorSlug: string | null }) {
  const { format, fxRate } = useCurrency()

  const [sector, setSector] = useState<SectorHit | null>(null)
  const [businessType, setBusinessType] = useState<BusinessType>('plc')
  const [employees, setEmployees] = useState(5)
  const [capital, setCapital] = useState(100_000)
  const [userType, setUserType] = useState<UserType>('local')

  // Load initial sector from URL slug
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

  const lines = useMemo(() => computeLines({ sector, businessType, employees, capital, userType, fxRate }), [
    sector,
    businessType,
    employees,
    capital,
    userType,
    fxRate,
  ])

  const totalBirr = lines.reduce((acc, l) => acc + l.amount, 0)
  const totalUsd = totalBirr / fxRate

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* INPUTS */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Sector</Label>
            <SectorPicker value={sector} onChange={setSector} />
          </div>

          <div className="space-y-2">
            <Label>Business type</Label>
            <Tabs value={businessType} onValueChange={(v) => setBusinessType(v as BusinessType)}>
              <TabsList className="w-full">
                {BUSINESS_TYPES.map((b) => (
                  <TabsTrigger key={b.value} value={b.value} className="flex-1">
                    {b.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label>Employees</Label>
                <span className="font-mono text-sm text-ink">{employees}</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[employees]}
                onValueChange={([v]) => setEmployees(v ?? 0)}
              />
              <p className="text-xs text-ink-faint">Adds payroll & registration overhead</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label>Initial capital (ETB)</Label>
                <span className="font-mono text-sm text-ink">
                  ₿ {capital.toLocaleString()}
                </span>
              </div>
              <Slider
                min={0}
                max={5_000_000}
                step={10_000}
                value={[capital]}
                onValueChange={([v]) => setCapital(v ?? 0)}
              />
              <p className="text-xs text-ink-faint">
                Floor for{' '}
                {BUSINESS_TYPES.find((b) => b.value === businessType)?.label}: ₿{' '}
                {(
                  BUSINESS_TYPES.find((b) => b.value === businessType)?.capitalFloor ?? 0
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>You are</Label>
            <Tabs value={userType} onValueChange={(v) => setUserType(v as UserType)}>
              <TabsList className="w-full">
                {USER_TYPES.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="flex-1">
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="text-xs text-ink-faint">
              Adjusts professional service multipliers (translation, attestation, escrow).
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <Chart
            type="bar"
            height={260}
            series={[
              {
                name: 'ETB',
                data: lines.map((l) => Math.round(l.amount)),
              },
            ]}
            options={{
              xaxis: { categories: lines.map((l) => l.label) },
              plotOptions: {
                bar: { borderRadius: 4, columnWidth: '55%', distributed: true },
              },
              legend: { show: false },
              tooltip: {
                y: { formatter: (v) => `₿ ${v.toLocaleString()}` },
              },
              yaxis: {
                labels: {
                  formatter: (v) =>
                    `₿${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}`,
                },
              },
            }}
          />
        </div>
      </Card>

      {/* SUMMARY */}
      <div className="space-y-4">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-wider text-brand">Estimated total</p>
          <p className="mt-2 text-4xl font-semibold tracking-crisp text-ink">
            ₿ {totalBirr.toLocaleString()}
          </p>
          <p className="text-sm text-ink-muted">≈ {format(totalUsd, { currency: 'USD' })}</p>
          <div className="mt-4 space-y-1.5 text-sm">
            {lines.map((l) => (
              <div key={l.label} className="flex items-baseline justify-between">
                <span className="text-ink-muted">{l.label}</span>
                <span className="font-mono text-ink">
                  ₿ {Math.round(l.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 text-xs text-ink-faint">
            FX 1 USD = ₿ {fxRate.toFixed(2)} · ranges are typical; actual fees vary by city
            office.
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
            <Lock className="h-3 w-3" /> Premium
          </div>
          <p className="mt-1.5 text-sm font-semibold text-ink">Export & save</p>
          <p className="mt-1 text-xs text-ink-muted">
            Premium subscribers can export a branded PDF cost report and save scenarios to revisit.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" disabled>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button variant="ghost" disabled>
              <FileSearch className="h-4 w-4" /> Save scenario
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function SectorPicker({
  value,
  onChange,
}: {
  value: SectorHit | null
  onChange: (s: SectorHit | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SectorHit[]>([])

  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) return
    const t = setTimeout(async () => {
      const params = new URLSearchParams()
      params.set('limit', '8')
      params.set('depth', '0')
      params.set('where[or][0][name_en][like]', q)
      params.set('where[or][1][mor_code][like]', q)
      const r = await fetch(`/api/business-sectors?${params.toString()}`)
      if (r.ok) setHits((await r.json()).docs ?? [])
    }, 180)
    return () => clearTimeout(t)
  }, [query, open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-left text-sm transition-colors hover:border-brand/40">
          {value ? (
            <span className="flex items-center gap-2 truncate">
              <Badge variant="mono">{value.mor_code}</Badge>
              <span className="truncate text-ink">{value.name_en}</span>
            </span>
          ) : (
            <span className="text-ink-faint">Choose a sector…</span>
          )}
          <Search className="h-4 w-4 shrink-0 text-ink-faint" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <Input
          autoFocus
          placeholder="Search 519 sectors…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9"
        />
        <div className="mt-2 max-h-72 overflow-y-auto">
          {hits.map((h) => (
            <button
              key={String(h.id)}
              onClick={() => {
                onChange(h)
                setOpen(false)
                setQuery('')
              }}
              className="flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left text-sm hover:bg-surface-2"
            >
              <span className="line-clamp-1 text-ink">{h.name_en}</span>
              <span className="font-mono text-xs text-ink-faint">{h.mor_code}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function computeLines({
  sector,
  businessType,
  employees,
  capital,
  userType,
  fxRate,
}: {
  sector: SectorHit | null
  businessType: BusinessType
  employees: number
  capital: number
  userType: UserType
  fxRate: number
}) {
  const userMult = USER_TYPES.find((u) => u.value === userType)?.mult ?? 1
  const capitalFloor = BUSINESS_TYPES.find((b) => b.value === businessType)?.capitalFloor ?? 0
  const effectiveCapital = Math.max(capital, capitalFloor)

  // All amounts in ETB (heuristic ranges; refine when fee schedule lands)
  const lines: { label: string; amount: number; tier: 'gov' | 'pro' | 'capital' }[] = [
    { label: 'Investment / commercial registration', amount: 5_000 * userMult, tier: 'gov' },
    { label: 'TIN registration', amount: 800, tier: 'gov' },
    { label: 'Trade licence (incl. annual)', amount: 1_500 * (sector ? 1.2 : 1), tier: 'gov' },
    {
      label: 'Sector approval fees',
      amount: sector ? 3_500 * userMult : 0,
      tier: 'gov',
    },
    { label: 'Legal & translation', amount: 8_000 * userMult, tier: 'pro' },
    { label: 'Notary & attestation', amount: 3_500 * userMult, tier: 'pro' },
    { label: 'Bank account setup', amount: 1_500 + employees * 200, tier: 'pro' },
    { label: 'Initial capital deposit', amount: effectiveCapital, tier: 'capital' },
  ]

  return lines.filter((l) => l.amount > 0)
}
