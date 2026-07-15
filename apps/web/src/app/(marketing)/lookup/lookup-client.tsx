'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, ExternalLink, Loader2, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { humanizeSectorName } from '@/lib/humanize-sector-name'

interface SectorHit {
  id: string | number
  slug: string
  mor_code: string
  name_en: string
  name_am?: string | null
  description_short?: string | null
  category?: { name_en: string; slug: string } | string | number | null
}

const RECENT_KEY = 'bb.lookup.recent'

export function LookupClient({
  popular,
}: {
  popular: { mor_code: string; name_en: string; slug: string }[]
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SectorHit[]>([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(RECENT_KEY)
    if (stored) {
      try {
        setRecent(JSON.parse(stored))
      } catch {
        /* noop */
      }
    }
  }, [])

  // Auto-lookup as you type
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        params.set('limit', '8')
        params.set('depth', '1')
        params.set('where[or][0][mor_code][like]', q)
        params.set('where[or][1][name_en][like]', q)
        const res = await fetch(`/api/business-sectors?${params.toString()}`)
        if (!res.ok) {
          setResults([])
          return
        }
        const data = await res.json()
        setResults(data.docs ?? [])
        // Save 5-digit codes to recent
        if (/^\d{5}$/.test(q)) {
          setRecent((prev) => {
            const next = [q, ...prev.filter((c) => c !== q)].slice(0, 6)
            window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
            return next
          })
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 150)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste a code: 11111, 35216, 64113…"
          className="h-16 w-full rounded-xl border border-border bg-surface pl-14 pr-14 font-mono text-lg text-ink shadow-elevated focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
        {query ? (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-faint hover:bg-surface-2 hover:text-ink"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Recent + popular when empty */}
      {!query ? (
        <div className="mt-6 space-y-4">
          {recent.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Recent
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQuery(c)}
                    className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted hover:border-brand/40 hover:text-ink"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {popular.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Popular codes
              </p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button
                    key={p.mor_code}
                    onClick={() => setQuery(p.mor_code)}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink-muted hover:border-brand/40 hover:text-ink"
                  >
                    <span className="mr-1 font-mono text-brand">{p.mor_code}</span>
                    {p.name_en.slice(0, 26)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Looking up…
        </div>
      ) : null}

      {results.length > 0 && !loading ? (
        <div className="mt-6 space-y-3">
          {results.map((s) => (
            <Card key={String(s.id)} className="p-5 transition-colors hover:border-brand/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="mono">MOR {s.mor_code}</Badge>
                    {typeof s.category === 'object' && s.category ? (
                      <Badge variant="default">{s.category.name_en}</Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tightish leading-snug text-ink">
                    {humanizeSectorName(s.mor_code, s.name_en)}
                  </h3>
                  {s.name_am ? (
                    <p className="mt-0.5 font-amharic text-sm text-ink-faint">{s.name_am}</p>
                  ) : null}
                  {s.description_short ? (
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                      {s.description_short}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      const url = `${window.location.origin}/lookup?code=${s.mor_code}`
                      navigator.clipboard.writeText(url)
                      toast.success('Link copied')
                    }}
                    aria-label="Copy share link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/sectors/${s.slug}`}>
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {query.length >= 2 && results.length === 0 && !loading ? (
        <Card className="mt-6 p-8 text-center">
          <p className="text-sm font-medium text-ink">No sectors match &quot;{query}&quot;</p>
          <p className="mt-1 text-sm text-ink-muted">
            MOR codes are 5 digits. Try a different code, or search by sector name.
          </p>
        </Card>
      ) : null}
    </div>
  )
}
