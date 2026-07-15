import type { Metadata } from 'next'
import { tryPayload } from '@/lib/payload'
import { LookupClient } from './lookup-client'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'MOR code lookup',
  description:
    'Paste any 5-digit MOR licensing code from Ethiopia Directive 17/2011 and instantly see the sector, issuing authority, and required ministry approvals.',
}

export const revalidate = 3600

export default async function LookupPage() {
  // Pre-fetch a few popular codes for quick-tap chips
  const popular = await tryPayload(async (payload) => {
    const r = await payload.find({
      collection: 'business-sectors',
      limit: 8,
      sort: 'mor_code',
      depth: 0,
    })
    return r.docs.map((s) => ({ mor_code: s.mor_code, name_en: s.name_en, slug: s.slug }))
  })

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="brand" className="mb-4 inline-flex">
              Free utility
            </Badge>
            <h1 className="text-balance text-5xl font-semibold tracking-crisp sm:text-6xl">
              MOR code lookup
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-ink-muted">
              Paste any 5-digit licensing code from MOR Directive 17/2011 to get the sector, the
              ministry that approves it, and the office that issues the license.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-2xl">
            <LookupClient popular={popular ?? []} />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tightish">How the codes work</h2>
          <div className="mt-6 grid gap-3 text-sm">
            <Item k="1xxxx" v="Agriculture, hunting, forestry and fishing" />
            <Item k="2xxxx" v="Mining and quarrying" />
            <Item k="3xxxx" v="Manufacturing" />
            <Item k="4xxxx" v="Electricity, gas, water supply and waste management" />
            <Item k="5xxxx" v="Construction" />
            <Item k="6xxxx" v="Wholesale, retail, hotels, import/export" />
            <Item k="7xxxx" v="Transport, storage and communication" />
            <Item k="8xxxx" v="Finance, insurance, real estate and business services" />
            <Item k="9xxxx" v="Community, social and personal services" />
          </div>
          <p className="mt-6 text-xs text-ink-faint">
            Each code is exactly 5 digits. The first digit identifies the top-level category; the
            full 5-digit code identifies one of 519 specific licensable activities.
          </p>
        </div>
      </section>
    </div>
  )
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3">
      <span className="font-mono text-sm font-semibold text-brand">{k}</span>
      <span className="text-ink-muted">{v}</span>
    </div>
  )
}
