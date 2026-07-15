'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Info, Landmark, Printer, Search } from 'lucide-react'
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
import { humanizeSectorName } from '@/lib/humanize-sector-name'

type BusinessType = 'sole_proprietorship' | 'plc'

interface SectorHit {
  id: string | number
  slug: string
  mor_code: string
  name_en: string
}

/**
 * Entity types we can price with confidence. Share companies and foreign
 * branches have different capital regimes we don't yet cover — book a consult
 * for those. Legal minimums come from the Commercial Code of Ethiopia
 * (Proc. 1243/2021) via the Ministry of Justice; recommended figures are
 * lived-experience estimates for 6–12 months of operating runway.
 */
const BUSINESS_TYPES: {
  value: BusinessType
  label: string
  legalMin: number
  recommended: number
}[] = [
  {
    value: 'sole_proprietorship',
    label: 'Sole proprietorship',
    legalMin: 0,
    recommended: 25_000,
  },
  {
    value: 'plc',
    label: 'Private Limited Company (PLC)',
    legalMin: 15_000,
    recommended: 250_000,
  },
]

const DEFAULT_CAPITAL = 250_000

function br(n: number): string {
  return `Br ${Math.round(n).toLocaleString()}`
}

export function CalculatorClient({ initialSectorSlug }: { initialSectorSlug: string | null }) {
  const { format, fxRate } = useCurrency()

  const [sector, setSector] = useState<SectorHit | null>(null)
  const [businessType, setBusinessType] = useState<BusinessType>('plc')
  const [employees, setEmployees] = useState(5)
  const [capital, setCapital] = useState(DEFAULT_CAPITAL)

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

  const activeType = BUSINESS_TYPES.find((b) => b.value === businessType)!
  const lines = useMemo(
    () => computeLines({ sector, businessType, employees, capital }),
    [sector, businessType, employees, capital],
  )

  const totalBirr = lines.reduce((acc, l) => acc + l.amount, 0)
  const totalUsd = totalBirr / fxRate

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card className="p-6 print:shadow-none">
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
            <p className="text-xs text-ink-faint">
              Share company + foreign branch require sector-specific advice — book a consult if
              you&apos;re going that route.
            </p>
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
              <p className="text-xs text-ink-faint">Adds payroll + registration overhead</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label>Initial capital</Label>
                <span className="font-mono text-sm text-ink">{br(capital)}</span>
              </div>
              <Slider
                min={0}
                max={5_000_000}
                step={5_000}
                value={[capital]}
                onValueChange={([v]) => setCapital(v ?? 0)}
              />
              <p className="text-xs text-ink-faint">
                MoJ legal minimum: {br(activeType.legalMin)} · Realistic 6–12mo runway:{' '}
                {br(activeType.recommended)}
              </p>
            </div>
          </div>

          {/* PLC operating-capital note */}
          {businessType === 'plc' ? (
            <div className="flex gap-3 rounded-lg border border-brand/25 bg-brand/5 p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div className="text-ink-muted">
                <strong className="text-ink">The Br 15,000 PLC minimum is a legal floor, not a
                budget.</strong>{' '}
                Very few PLCs actually run on it. Plan for rent, staff, inventory, licenses, and
                the first two months of losses — a realistic starting figure is
                Br 250,000–1,500,000 depending on sector. The calculator uses the higher of what
                you enter or the legal floor.
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-2 text-xs uppercase tracking-wider text-brand">Line items</p>
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
              chart: { toolbar: { show: false } },
              xaxis: { categories: lines.map((l) => l.label) },
              plotOptions: {
                bar: { borderRadius: 4, columnWidth: '55%', distributed: true },
              },
              legend: { show: false },
              tooltip: {
                y: { formatter: (v) => br(v) },
              },
              yaxis: {
                labels: {
                  formatter: (v) =>
                    `Br ${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}`,
                },
              },
            }}
          />
          <p className="mt-3 text-2xs text-ink-faint">
            Source: Ethiopian Commercial Code (Proclamation 1243/2021), MOR fee schedule, and
            local practitioner interviews (2025–2026). Ranges vary by city office and by year.
          </p>
        </div>
      </Card>

      <div className="space-y-4 print:space-y-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-wider text-brand">Estimated total</p>
          <p className="mt-2 text-4xl font-semibold tracking-crisp text-ink">{br(totalBirr)}</p>
          <p className="text-sm text-ink-muted">≈ {format(totalUsd, { currency: 'USD' })}</p>
          <div className="mt-4 space-y-1.5 text-sm">
            {lines.map((l) => (
              <div key={l.label} className="flex items-baseline justify-between">
                <span className="text-ink-muted">{l.label}</span>
                <span className="font-mono text-ink">{br(l.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 text-xs text-ink-faint">
            FX 1 USD ≈ Br {fxRate.toFixed(2)} · ranges are typical, not authoritative. Verify
            each fee at the office you file with.
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-brand">Next step</p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Reserve your trade name and register your TIN on the Ministry of Trade&apos;s eTrade
            portal — that&apos;s where the fees above get paid.
          </p>
          <Button asChild className="mt-4 w-full">
            <a href="https://etrade.gov.et" target="_blank" rel="noreferrer">
              <Landmark className="h-4 w-4" /> Open eTrade
            </a>
          </Button>
        </Card>

        <Card className="p-5 print:hidden">
          <p className="text-xs uppercase tracking-wider text-ink-faint">Save this estimate</p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Print or export to PDF — your browser handles both from one dialog.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </Button>
            <Button variant="ghost" asChild>
              <a
                href={`data:text/csv,${encodeURIComponent(csvExport(sector, activeType, employees, capital, lines, totalBirr))}`}
                download={`bizbridge-estimate${sector ? '-' + sector.mor_code : ''}.csv`}
              >
                <Download className="h-4 w-4" /> Download CSV
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function csvExport(
  sector: SectorHit | null,
  type: (typeof BUSINESS_TYPES)[number],
  employees: number,
  capital: number,
  lines: { label: string; amount: number }[],
  total: number,
): string {
  const rows = [
    ['BizBridge Ethiopia · cost estimate'],
    ['Source', 'Ethiopian Commercial Code (Proc. 1243/2021), MOR fee schedule'],
    [],
    ['Sector', sector ? `${humanizeSectorName(sector.mor_code, sector.name_en)} (MOR ${sector.mor_code})` : '—'],
    ['Business type', type.label],
    ['Employees', String(employees)],
    ['Initial capital (Br)', String(capital)],
    [],
    ['Line item', 'Amount (Br)'],
    ...lines.map((l) => [l.label, String(Math.round(l.amount))]),
    ['TOTAL', String(Math.round(total))],
  ]
  return rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
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
              <span className="truncate text-ink">
                {humanizeSectorName(value.mor_code, value.name_en)}
              </span>
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
              <span className="line-clamp-1 text-ink">
                {humanizeSectorName(h.mor_code, h.name_en)}
              </span>
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
}: {
  sector: SectorHit | null
  businessType: BusinessType
  employees: number
  capital: number
}) {
  const type = BUSINESS_TYPES.find((b) => b.value === businessType)!
  const effectiveCapital = Math.max(capital, type.legalMin)

  const lines: { label: string; amount: number; tier: 'gov' | 'pro' | 'capital' }[] = [
    { label: 'Investment / commercial registration', amount: 5_000, tier: 'gov' },
    { label: 'TIN registration', amount: 800, tier: 'gov' },
    { label: 'Trade licence (incl. annual)', amount: sector ? 1_800 : 1_500, tier: 'gov' },
    { label: 'Sector approval fees', amount: sector ? 3_500 : 0, tier: 'gov' },
    { label: 'Legal & translation', amount: 8_000, tier: 'pro' },
    { label: 'Notary & attestation', amount: 3_500, tier: 'pro' },
    { label: 'Bank account setup', amount: 1_500 + employees * 200, tier: 'pro' },
    { label: 'Initial capital deposit', amount: effectiveCapital, tier: 'capital' },
  ]

  return lines.filter((l) => l.amount > 0)
}
