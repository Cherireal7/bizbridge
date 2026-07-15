import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { CheckoutClient } from './checkout-client'
import { ENABLE_ACCOUNTS } from '@/lib/flags'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Pay once. Pick the method that works for you — Chapa, TeleBirr, or Remitly bank transfer.',
}

interface PageProps {
  searchParams: Promise<{ tier?: 'standard' | 'pro'; type?: 'tier' | 'report'; slug?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  if (!ENABLE_ACCOUNTS) notFound()
  const sp = await searchParams
  const kind = sp.type === 'report' ? 'report' : 'tier'
  const tier = sp.tier ?? 'standard'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-12 sm:py-16">
          <Badge variant="brand" className="mb-4 inline-flex">
            Checkout
          </Badge>
          <h1 className="text-balance text-3xl font-semibold tracking-crisp sm:text-4xl lg:text-5xl">
            One payment.{' '}
            <span className="text-ink-muted">Lifetime access.</span>
          </h1>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <CheckoutClient kind={kind} tier={tier} reportSlug={sp.slug ?? null} />
      </section>
    </div>
  )
}
