import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { ENABLE_ACCOUNTS } from '@/lib/flags'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!ENABLE_ACCOUNTS) notFound()
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between border-b border-border/40 px-8 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tightish">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-strong text-brand-foreground text-sm">
              B
            </span>
            BizBridge
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Brand visual side */}
      <div className="relative hidden overflow-hidden border-l border-border bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.4) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 30% 30%, rgb(var(--brand) / 0.18), transparent 70%)',
          }}
        />
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/30">
            <MapPin className="h-3 w-3" /> Bishoftu first
          </p>
          <h1 className="mt-6 max-w-md text-balance text-4xl font-semibold tracking-crisp">
            Every sector. Every fee.{' '}
            <span className="text-ink-muted">All the way to your trade license.</span>
          </h1>
          <p className="mt-4 max-w-md text-pretty text-ink-muted">
            Join entrepreneurs, diaspora, and foreign investors using BizBridge to open
            businesses in Ethiopia without paying middlemen.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Official sectors" value="519" />
          <Stat label="Issuing authorities" value="17" />
          <Stat label="Languages" value="EN · AM" />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg/50 p-4">
      <p className="text-xs uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tightish">{value}</p>
    </div>
  )
}
