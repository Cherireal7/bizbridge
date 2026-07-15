import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { WizardClient } from './wizard-client'

export const metadata: Metadata = {
  title: 'Sector wizard',
  description:
    'Five questions, three personalized sector recommendations. The fastest way to figure out where to start.',
}

export default function WizardPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20">
          <Badge variant="brand" className="mb-4 inline-flex">
            Sector wizard
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl">
            Five questions.{' '}
            <span className="text-ink-muted">A short list of sectors that actually fit you.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-ink-muted">
            Tell us about your situation. We&apos;ll narrow 519 official sectors down to the
            three best matches with reasoning — then point you at the full guide for each.
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <WizardClient />
      </section>
    </div>
  )
}
