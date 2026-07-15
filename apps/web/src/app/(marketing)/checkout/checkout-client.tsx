'use client'

import { useState } from 'react'
import { Banknote, Check, CreditCard, Phone, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCurrency } from '@/components/providers/currency-provider'
import { cn } from '@/lib/cn'

const TIER_LABELS: Record<'standard' | 'pro', { name: string; usd: number; etb: number; tagline: string }> = {
  standard: { name: 'Standard', usd: 29, etb: 1600, tagline: 'Full guide for every sector' },
  pro: { name: 'Pro', usd: 149, etb: 8400, tagline: 'Everything + lawyer consultation' },
}

type Method = 'chapa' | 'telebirr' | 'bank-transfer'

interface CheckoutClientProps {
  kind: 'tier' | 'report'
  tier: 'standard' | 'pro'
  reportSlug: string | null
}

export function CheckoutClient({ kind, tier, reportSlug }: CheckoutClientProps) {
  const { currency, format } = useCurrency()
  const [method, setMethod] = useState<Method>('chapa')
  const [loading, setLoading] = useState(false)
  const [bankResult, setBankResult] = useState<BankResult | null>(null)

  const order =
    kind === 'tier'
      ? {
          title: `BizBridge ${TIER_LABELS[tier].name}`,
          subtitle: TIER_LABELS[tier].tagline,
          usd: TIER_LABELS[tier].usd,
          etb: TIER_LABELS[tier].etb,
        }
      : {
          title: `Research report · ${reportSlug ?? 'unnamed'}`,
          subtitle: 'One-time purchase · lifetime download',
          usd: 29, // placeholder until server-side report lookup is wired
          etb: 1500,
        }

  async function submit() {
    setLoading(true)
    setBankResult(null)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
      const body = JSON.stringify({
        kind,
        ...(kind === 'tier' ? { tier } : { report_slug: reportSlug, amount_etb: order.etb }),
      })
      const res = await fetch(`${apiBase}/api/checkout/${method}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.message ?? data?.error ?? 'Checkout failed')
        return
      }
      if (method === 'bank-transfer') {
        setBankResult(data)
      } else if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* PAYMENT METHODS */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-wider text-brand">Pick a payment method</p>

        <PaymentOption
          method="chapa"
          active={method === 'chapa'}
          onSelect={() => setMethod('chapa')}
          icon={CreditCard}
          title="Chapa"
          subtitle="Pay instantly with Ethiopian card, bank, or mobile. Recommended."
          badge="Instant"
          tags={['Visa · MasterCard', 'CBE Birr', 'Telebirr via Chapa']}
        />
        <PaymentOption
          method="telebirr"
          active={method === 'telebirr'}
          onSelect={() => setMethod('telebirr')}
          icon={Phone}
          title="TeleBirr direct"
          subtitle="Pay from your TeleBirr balance. Confirmation in seconds."
          badge="Instant"
          tags={['Mobile money', 'Ethio Telecom']}
        />
        <PaymentOption
          method="bank-transfer"
          active={method === 'bank-transfer'}
          onSelect={() => setMethod('bank-transfer')}
          icon={Banknote}
          title="Bank transfer / Remitly"
          subtitle="Wire from your bank or Remitly to our CBE account. Manual confirmation within 24h."
          badge="24h"
          tags={['Diaspora · USD', 'CBE deposit', 'Bank wire']}
        />

        <p className="pt-2 text-xs text-ink-faint">
          No Stripe. No subscriptions. No recurring charges. Your payment unlocks lifetime access
          to your tier.
        </p>

        {bankResult ? <BankInstructions result={bankResult} /> : null}
      </div>

      {/* ORDER SUMMARY */}
      <Card className="p-6 lg:sticky lg:top-24 h-fit">
        <p className="text-xs uppercase tracking-wider text-brand">Order</p>
        <h2 className="mt-2 text-lg font-semibold tracking-tightish">{order.title}</h2>
        <p className="text-xs text-ink-muted">{order.subtitle}</p>

        <div className="mt-6 space-y-2 text-sm">
          <Row label="Subtotal" value={currency === 'USD' ? format(order.usd) : `ETB ${order.etb.toLocaleString()}`} />
          <Row label="VAT" value="Included" />
          <div className="border-t border-border pt-2">
            <Row
              label={<span className="font-medium text-ink">Total</span>}
              value={
                <span className="text-xl font-semibold tracking-tightish text-ink">
                  {currency === 'USD' ? format(order.usd) : `ETB ${order.etb.toLocaleString()}`}
                </span>
              }
            />
          </div>
        </div>

        <Button onClick={submit} disabled={loading} size="lg" className="mt-6 w-full">
          {loading ? 'Connecting…' : method === 'bank-transfer' ? 'Get bank details' : `Pay with ${prettyMethod(method)}`}
        </Button>

        <ul className="mt-6 space-y-2 text-xs text-ink-muted">
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> 14-day refund if data is materially wrong
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> One-time payment · no auto-renewal
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> Lifetime access · including future updates
          </li>
        </ul>
      </Card>
    </div>
  )
}

function PaymentOption({
  active,
  onSelect,
  icon: Icon,
  title,
  subtitle,
  badge,
  tags,
}: {
  method: Method
  active: boolean
  onSelect: () => void
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  badge?: string
  tags?: string[]
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-4 rounded-lg border bg-surface p-5 text-left transition-all',
        active ? 'border-brand bg-surface-2 shadow-glow' : 'border-border hover:border-brand/40',
      )}
    >
      <span
        className={cn(
          'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-md transition-colors',
          active ? 'bg-brand text-brand-foreground' : 'bg-surface-2 text-ink-muted',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {badge ? <Badge variant={active ? 'brand' : 'outline'}>{badge}</Badge> : null}
        </div>
        <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>
        {tags && tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface-3 px-2 py-0.5 text-2xs text-ink-faint"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <span
        className={cn(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
          active ? 'border-brand bg-brand' : 'border-border',
        )}
      >
        {active ? <Check className="h-3 w-3 text-brand-foreground" /> : null}
      </span>
    </button>
  )
}

interface BankResult {
  reference: string
  amount_etb: number
  amount_usd: number
  bank: {
    bank_name: string
    account_name: string
    account_number: string
    swift: string
    branch: string
  }
  remitly_recipient?: { name: string; country: string; delivery: string }
}

function BankInstructions({ result }: { result: BankResult }) {
  return (
    <Card className="p-6 border-brand/40">
      <p className="text-xs uppercase tracking-wider text-brand">Send the transfer</p>
      <p className="mt-2 text-sm text-ink-muted">
        Wire <strong className="text-ink">${result.amount_usd}</strong> (~ETB {result.amount_etb.toLocaleString()})
        with the reference code <strong className="font-mono text-ink">{result.reference}</strong>,
        then email <a href="mailto:hello@bizbridge.et" className="text-brand underline">hello@bizbridge.et</a>{' '}
        with your name and the reference. Access unlocks within 24h.
      </p>
      <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <BankRow label="Bank" value={result.bank.bank_name} />
        <BankRow label="Account name" value={result.bank.account_name} />
        <BankRow label="Account number" value={result.bank.account_number} mono />
        <BankRow label="SWIFT" value={result.bank.swift} mono />
        <BankRow label="Branch" value={result.bank.branch} />
        <BankRow label="Your reference" value={result.reference} mono highlight />
      </dl>
      {result.remitly_recipient ? (
        <div className="mt-5 rounded-md border border-border bg-bg/40 p-4 text-xs text-ink-muted">
          <strong className="text-ink">Remitly tip:</strong> deliver to{' '}
          {result.remitly_recipient.country} via {result.remitly_recipient.delivery}. Recipient
          name on your transfer must match your BizBridge account so we can match the payment.
        </div>
      ) : null}
    </Card>
  )
}

function BankRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className={cn('border-b border-border/60 pb-2 last:border-0', highlight && 'rounded bg-brand/10 px-3 py-2 border-0')}>
      <dt className="text-2xs uppercase tracking-wider text-ink-faint">{label}</dt>
      <dd className={cn('mt-0.5', mono && 'font-mono', highlight ? 'text-brand font-semibold' : 'text-ink')}>{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

function prettyMethod(m: Method): string {
  return m === 'chapa' ? 'Chapa' : m === 'telebirr' ? 'TeleBirr' : 'Bank transfer'
}
