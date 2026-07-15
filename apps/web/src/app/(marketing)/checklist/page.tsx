import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { ChecklistClient } from './checklist-client'

export const metadata: Metadata = {
  title: 'Setup checklist',
  description: 'Personalized step-by-step checklist for opening your business in Ethiopia.',
}

interface PageProps {
  searchParams: Promise<{ sector?: string }>
}

export default async function ChecklistPage({ searchParams }: PageProps) {
  const { sector } = await searchParams
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16">
          <Badge variant="brand" className="mb-4 inline-flex">
            Setup checklist
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl">
            Don&apos;t lose a step.{' '}
            <span className="text-ink-muted">Check them off as you go.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-ink-muted">
            A personalized checklist for opening your business in Ethiopia. Sequenced correctly,
            with the right office and document at each step. Progress saves automatically.
          </p>
        </div>
      </section>
      <section className="container-page py-10">
        <ChecklistClient initialSectorSlug={sector ?? null} />
      </section>
    </div>
  )
}
