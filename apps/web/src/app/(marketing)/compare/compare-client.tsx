'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Plus, Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface SectorHit {
  id: string | number
  slug: string
  mor_code: string
  name_en: string
  name_am?: string | null
  category?: { name_en: string } | string | number | null
}

interface SectorFull extends SectorHit {
  licenses: { license_type: string; issuing_authority: string }[]
  approvals: { approval_name: string; approving_ministry: string; sequence_order: number }[]
  costs: {
    cost_item: string
    amount_birr_min?: number | null
    amount_birr_max?: number | null
    is_official_fee: boolean
  }[]
  certificates: { certificate_name: string; issuing_body: string; is_mandatory: boolean }[]
  steps: { step_number: number; title: string; estimated_days?: number | null }[]
}

const MAX_COMPARE = 3

export function CompareClient({ initialAdd }: { initialAdd: string | null }) {
  const router = useRouter()
  const params = useSearchParams()
  const slugsParam = params.get('s')
  const initialSlugs = slugsParam ? slugsParam.split(',').filter(Boolean) : []
  if (initialAdd && !initialSlugs.includes(initialAdd)) initialSlugs.push(initialAdd)

  const [slugs, setSlugs] = useState<string[]>(initialSlugs.slice(0, MAX_COMPARE))
  const [sectors, setSectors] = useState<Record<string, SectorFull | null>>({})
  const [loading, setLoading] = useState(false)

  // Sync URL with selected slugs
  useEffect(() => {
    const next = new URLSearchParams()
    if (slugs.length > 0) next.set('s', slugs.join(','))
    router.replace(`/compare${slugs.length > 0 ? `?${next.toString()}` : ''}`, {
      scroll: false,
    })
  }, [slugs, router])

  // Fetch sector details when slugs change
  useEffect(() => {
    if (slugs.length === 0) return
    setLoading(true)
    Promise.all(
      slugs.map(async (slug) => {
        try {
          const params = new URLSearchParams()
          params.set('where[slug][equals]', slug)
          params.set('limit', '1')
          params.set('depth', '1')
          const r = await fetch(`/api/business-sectors?${params.toString()}`)
          if (!r.ok) return [slug, null] as const
          const data = await r.json()
          const sector = data.docs?.[0]
          if (!sector) return [slug, null] as const

          const [licenses, approvals, costs, certificates, steps] = await Promise.all([
            fetchSub('sector-license-requirements', sector.id),
            fetchSub('sector-approvals', sector.id, 'sequence_order'),
            fetchSub('sector-costs', sector.id),
            fetchSub('sector-competency-certificates', sector.id),
            fetchSub('sector-steps', sector.id, 'step_number'),
          ])

          return [
            slug,
            {
              ...sector,
              licenses,
              approvals,
              costs,
              certificates,
              steps,
            },
          ] as const
        } catch {
          return [slug, null] as const
        }
      }),
    )
      .then((results) => {
        const next: Record<string, SectorFull | null> = {}
        for (const [slug, data] of results) next[slug] = data as SectorFull | null
        setSectors(next)
      })
      .finally(() => setLoading(false))
  }, [slugs])

  return (
    <div>
      {/* Selection row */}
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: MAX_COMPARE }).map((_, i) => {
          const slug = slugs[i]
          const sector = slug ? sectors[slug] : null
          return (
            <SectorSlot
              key={i}
              index={i}
              sector={sector ?? null}
              loading={loading && slug !== undefined && !sector}
              onAdd={(s) => {
                setSlugs((prev) => {
                  if (prev.includes(s.slug)) return prev
                  const next = [...prev]
                  next[i] = s.slug
                  return next.filter(Boolean).slice(0, MAX_COMPARE)
                })
              }}
              onRemove={() => {
                setSlugs((prev) => prev.filter((_, idx) => idx !== i))
              }}
            />
          )
        })}
      </div>

      {/* Comparison table */}
      {slugs.length > 0 ? (
        <Card className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-left text-xs uppercase tracking-wider text-ink-faint">
                <th className="sticky left-0 z-10 bg-surface-2/40 px-4 py-3 font-medium">
                  Attribute
                </th>
                {slugs.map((s) => (
                  <th key={s} className="px-4 py-3 font-medium text-ink">
                    {sectors[s]?.name_en ?? s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <CompareRow label="MOR code" slugs={slugs} sectors={sectors} cell={(s) => (
                <span className="font-mono text-brand">{s.mor_code}</span>
              )} />
              <CompareRow label="Category" slugs={slugs} sectors={sectors} cell={(s) =>
                typeof s.category === 'object' && s.category ? s.category.name_en : '—'
              } />
              <CompareRow label="Amharic name" slugs={slugs} sectors={sectors} cell={(s) => (
                <span className="font-amharic">{s.name_am ?? '—'}</span>
              )} />
              <CompareRow label="Licenses required" slugs={slugs} sectors={sectors} cell={(s) =>
                s.licenses.length === 0
                  ? '—'
                  : s.licenses.map((l) => l.license_type).join(', ')
              } />
              <CompareRow label="Issuing authority" slugs={slugs} sectors={sectors} cell={(s) =>
                s.licenses[0]?.issuing_authority ?? '—'
              } />
              <CompareRow label="Ministry approvals" slugs={slugs} sectors={sectors} cell={(s) =>
                s.approvals.length
              } />
              <CompareRow label="Approval chain" slugs={slugs} sectors={sectors} cell={(s) =>
                s.approvals.length === 0
                  ? '—'
                  : (
                    <ul className="space-y-1 text-xs">
                      {s.approvals.slice(0, 3).map((a, i) => (
                        <li key={i} className="text-ink-muted">
                          {i + 1}. {a.approving_ministry}
                        </li>
                      ))}
                      {s.approvals.length > 3 ? (
                        <li className="text-ink-faint">+ {s.approvals.length - 3} more</li>
                      ) : null}
                    </ul>
                  )
              } />
              <CompareRow label="Certificates" slugs={slugs} sectors={sectors} cell={(s) =>
                s.certificates.length === 0 ? '—' : `${s.certificates.length} (${s.certificates.filter((c) => c.is_mandatory).length} mandatory)`
              } />
              <CompareRow label="Setup steps" slugs={slugs} sectors={sectors} cell={(s) =>
                s.steps.length === 0 ? '—' : s.steps.length
              } />
              <CompareRow label="Documented fees" slugs={slugs} sectors={sectors} cell={(s) =>
                s.costs.length === 0
                  ? '—'
                  : `${s.costs.filter((c) => c.is_official_fee).length} official · ${s.costs.length} total`
              } />
              <CompareRow label="Open" slugs={slugs} sectors={sectors} cell={(s) => (
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/sectors/${s.slug}`}>
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )} />
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="mt-10 p-12 text-center">
          <p className="text-sm font-medium text-ink">Add up to 3 sectors to compare</p>
          <p className="mt-1 text-sm text-ink-muted">
            Use the chips above. Share the URL to send the comparison to a cofounder.
          </p>
        </Card>
      )}
    </div>
  )
}

async function fetchSub(collection: string, sectorId: string | number, sort?: string) {
  const params = new URLSearchParams()
  params.set('where[sector][equals]', String(sectorId))
  params.set('limit', '50')
  params.set('depth', '0')
  if (sort) params.set('sort', sort)
  const r = await fetch(`/api/${collection}?${params.toString()}`)
  if (!r.ok) return []
  const data = await r.json()
  return data.docs ?? []
}

function CompareRow({
  label,
  slugs,
  sectors,
  cell,
}: {
  label: string
  slugs: string[]
  sectors: Record<string, SectorFull | null>
  cell: (s: SectorFull) => React.ReactNode
}) {
  return (
    <tr>
      <td className="sticky left-0 bg-surface/95 px-4 py-3 text-xs uppercase tracking-wider text-ink-faint backdrop-blur">
        {label}
      </td>
      {slugs.map((s) => {
        const sector = sectors[s]
        return (
          <td key={s} className="px-4 py-3 align-top text-ink">
            {sector ? cell(sector) : <span className="text-ink-faint">…</span>}
          </td>
        )
      })}
    </tr>
  )
}

function SectorSlot({
  index,
  sector,
  loading,
  onAdd,
  onRemove,
}: {
  index: number
  sector: SectorFull | null
  loading: boolean
  onAdd: (s: SectorHit) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SectorHit[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setHits([])
      return
    }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        params.set('limit', '8')
        params.set('depth', '0')
        params.set('where[or][0][name_en][like]', q)
        params.set('where[or][1][mor_code][like]', q)
        const r = await fetch(`/api/business-sectors?${params.toString()}`)
        if (!r.ok) {
          setHits([])
          return
        }
        const data = await r.json()
        setHits(data.docs ?? [])
      } finally {
        setSearching(false)
      }
    }, 180)
    return () => clearTimeout(t)
  }, [query, open])

  if (sector) {
    return (
      <Card className="relative p-5">
        <button
          onClick={onRemove}
          className="absolute right-3 top-3 rounded-md p-1 text-ink-faint hover:bg-surface-2 hover:text-ink"
          aria-label="Remove"
        >
          <X className="h-4 w-4" />
        </button>
        <Badge variant="mono" className="mb-2">{sector.mor_code}</Badge>
        <p className="text-sm font-semibold text-ink">{sector.name_en}</p>
        {sector.name_am ? (
          <p className="mt-0.5 truncate font-amharic text-xs text-ink-faint">{sector.name_am}</p>
        ) : null}
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-8 text-sm text-ink-muted">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
      </Card>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-full min-h-[7rem] w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/50 px-5 py-6 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:bg-surface hover:text-ink">
          <Plus className="h-4 w-4" /> Add sector #{index + 1}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
          <Input
            autoFocus
            placeholder="Search by name or MOR code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-7"
          />
        </div>
        <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
          {searching ? (
            <p className="px-2 py-3 text-xs text-ink-muted">Searching…</p>
          ) : null}
          {!searching && hits.length > 0 ? (
            hits.map((h) => (
              <button
                key={String(h.id)}
                onClick={() => {
                  onAdd(h)
                  setOpen(false)
                  setQuery('')
                }}
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left text-sm hover:bg-surface-2"
              >
                <span className="line-clamp-1 text-ink">{h.name_en}</span>
                <span className="font-mono text-xs text-ink-faint">{h.mor_code}</span>
              </button>
            ))
          ) : null}
          {!searching && query.length >= 2 && hits.length === 0 ? (
            <p className="px-2 py-3 text-xs text-ink-muted">No matches.</p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
