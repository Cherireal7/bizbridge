import { notFound } from 'next/navigation'
import { tryPayload } from '@/lib/payload'
import { PricingTable } from './pricing-table'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GridBackdrop } from '@/components/marketing/grid-backdrop'
import { ENABLE_ACCOUNTS } from '@/lib/flags'

export const revalidate = 600

interface OneTimePrices {
  standard: { usd: number; etb: number }
  pro: { usd: number; etb: number }
}

export default async function PricingPage() {
  if (!ENABLE_ACCOUNTS) notFound()
  const pricing = await tryPayload(async (payload) => {
    return payload.findGlobal({ slug: 'pricing-config' })
  })

  const prices: OneTimePrices = {
    standard: {
      usd: pricing?.one_time?.standard?.usd ?? 29,
      etb: pricing?.one_time?.standard?.etb ?? 1600,
    },
    pro: {
      usd: pricing?.one_time?.pro?.usd ?? 149,
      etb: pricing?.one_time?.pro?.etb ?? 8400,
    },
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <GridBackdrop />
        <div className="container-page py-16 sm:py-20 text-center">
          <Badge variant="brand" className="mb-5 inline-flex">
            One-time payment
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-crisp sm:text-5xl lg:text-6xl">
            Pay once.{' '}
            <span className="text-ink-muted">Keep what you bought.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base sm:text-lg text-ink-muted">
            No subscriptions, no renewals. Pay once via Chapa, TeleBirr, or a Remitly bank
            transfer and keep lifetime access to the research, the process guide, and (Pro) a
            session with a lawyer.
          </p>
        </div>
      </section>

      <PricingTable prices={prices} />

      <section className="border-y border-border bg-surface">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-brand">Side by side</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
              What you get
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-bg">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-ink-faint">
                <tr>
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 font-medium">Free</th>
                  <th className="px-4 py-3 font-medium text-brand">Standard</th>
                  <th className="px-4 py-3 font-medium text-brand">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-ink">
                <Row feature="519 sector overviews" free="✓" std="✓" pro="✓" />
                <Row feature="MOR code lookup tool" free="✓" std="✓" pro="✓" />
                <Row feature="Bishoftu Pulse public data" free="✓" std="✓" pro="✓" />
                <Row feature="Sector decision wizard" free="✓" std="✓" pro="✓" />
                <Row feature="Full setup process per sector" free="—" std="✓" pro="✓" />
                <Row feature="Official fees + estimates" free="—" std="✓" pro="✓" />
                <Row feature="Full ministry approval chains" free="First only" std="✓" pro="✓" />
                <Row feature="Cost calculator + export" free="Preview" std="✓ + PDF" pro="✓ + PDF" />
                <Row feature="Personalized checklist" free="Local only" std="Synced" pro="Synced" />
                <Row feature="Document templates" free="—" std="✓" pro="✓" />
                <Row feature="All survey research reports" free="—" std="3 included" pro="All included" />
                <Row feature="Bishoftu market research" free="Summary" std="✓" pro="✓ + raw data" />
                <Row feature="30-min lawyer consultation" free="—" std="—" pro="✓ (one slot)" />
                <Row feature="Email guidance" free="—" std="✓" pro="Priority" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-wider text-brand">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tightish sm:text-4xl">
            Common questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="rounded-lg border border-border bg-surface px-4 sm:px-6">
          <AccordionItem value="one-time">
            <AccordionTrigger>How does the one-time payment work?</AccordionTrigger>
            <AccordionContent>
              You pay once and keep lifetime access to everything in that tier. No recurring
              charges, ever. If we add new sector data or research later, you get it included.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment">
            <AccordionTrigger>Which payment methods can I use?</AccordionTrigger>
            <AccordionContent>
              Three options at checkout: Chapa (ETB card / mobile), TeleBirr (Ethiopian mobile
              money), or a bank transfer / Remitly to our Bishoftu account (USD). Pick whichever
              works for you. No Stripe, no PayPal, no recurring billing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="registration">
            <AccordionTrigger>Will BizBridge open the business for me?</AccordionTrigger>
            <AccordionContent>
              No — and that&apos;s on purpose. We sell the research and the step-by-step process
              so you can do the registration yourself with confidence. Pro members can book a
              30-minute lawyer consultation to talk through their business idea, business model,
              and any specific registration questions before they go.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="scope">
            <AccordionTrigger>Is this only for Bishoftu?</AccordionTrigger>
            <AccordionContent>
              Bishoftu / Debrezeit is our specialty — most field research and on-the-ground
              detail comes from there. The MOR sector codes and process apply across the Oromia
              region and federal Ethiopia, so it&apos;s useful anywhere you&apos;re opening up.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="refund">
            <AccordionTrigger>Refunds?</AccordionTrigger>
            <AccordionContent>
              If you bought Standard or Pro and find a material error in our data within 14 days,
              email us and we&apos;ll refund you in full. Otherwise: pay-once means once.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lawyer">
            <AccordionTrigger>What can the lawyer help with?</AccordionTrigger>
            <AccordionContent>
              Business idea sanity check, business model structure, sector selection, which
              entity type to register, what licenses you&apos;ll need, common pitfalls. Not for
              running your actual registration on your behalf — that&apos;s your job (and
              you&apos;ll have the process guide to follow).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}

function Row({ feature, free, std, pro }: { feature: string; free: string; std: string; pro: string }) {
  return (
    <tr>
      <td className="px-4 py-3 text-ink">{feature}</td>
      <td className="px-4 py-3 text-ink-muted">{free}</td>
      <td className="px-4 py-3 text-ink">{std}</td>
      <td className="px-4 py-3 text-ink">{pro}</td>
    </tr>
  )
}
