import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { CompareClient } from './compare-client'

export const metadata: Metadata = {
  title: 'Compare sectors',
  description:
    'Side-by-side comparison of up to three Ethiopian business sectors — fees, ministry approvals, licenses, certificates.',
}

interface PageProps {
  searchParams: Promise<{ add?: string }>
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { add } = await searchParams
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16">
          <Badge variant="brand" className="mb-4 inline-flex">
            Compare
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl">
            Three sectors. Side by side. <span className="text-ink-muted">Decide faster.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-ink-muted">
            Pick any combination of MOR sector codes — see fees, timelines, ministry approvals,
            and required certificates next to each other. Share the URL to debate it with a
            cofounder or advisor.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <CompareClient initialAdd={add ?? null} />
      </section>
    </div>
  )
}
