import Link from 'next/link'
import { CommandPaletteProvider } from '@/components/command-palette/command-palette'
import { CommandTrigger } from '@/components/command-palette/command-trigger'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { SupportWidget } from '@/components/support-widget'
import { MobileNav } from '@/components/marketing/mobile-nav'
import { ENABLE_ACCOUNTS, CONSULT_EMAIL } from '@/lib/flags'

const BASE_NAV = [
  { href: '/', label: 'Home' },
  { href: '/sectors', label: 'Sectors' },
  { href: '/bishoftu', label: 'Research' },
  { href: '/reports', label: 'Reports' },
  { href: '/partners', label: 'Partners' },
  { href: '/blog', label: 'Blog' },
  { href: '/consult', label: 'Consult' },
]

const NAV = ENABLE_ACCOUNTS
  ? [...BASE_NAV.slice(0, -1), { href: '/pricing', label: 'Pricing' }, BASE_NAV[BASE_NAV.length - 1]!]
  : BASE_NAV

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/85 backdrop-blur-md">
          <div className="container-page flex h-16 items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tightish">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-strong text-brand-foreground text-sm">
                B
              </span>
              <span className="hidden text-sm sm:inline">BizBridge</span>
            </Link>

            <nav className="ml-3 hidden flex-1 items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
              <CommandTrigger className="hidden md:inline-flex" />
              <ThemeToggle />
              {ENABLE_ACCOUNTS ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild size="sm" className="hidden md:inline-flex">
                    <Link href="/signup">Get started</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" className="hidden md:inline-flex">
                  <Link href="/consult">Book a consult</Link>
                </Button>
              )}
              <MobileNav nav={NAV} className="lg:hidden" />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-surface">
          <div className="container-page py-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-semibold tracking-tightish"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-strong text-brand-foreground text-sm">
                    B
                  </span>
                  BizBridge Ethiopia
                </Link>
                <p className="mt-3 max-w-sm text-sm text-ink-muted">
                  An independent guide to opening a business in Ethiopia — every MOR sector,
                  every fee, every ministry approval. Built for Addis and Bishoftu, applicable
                  across Oromia and federal Ethiopia.
                </p>
              </div>

              <FooterColumn
                title="Product"
                links={[
                  { href: '/sectors', label: 'All 519 sectors' },
                  { href: '/reports', label: 'Reports catalog' },
                  { href: '/lookup', label: 'MOR code lookup' },
                  { href: '/compare', label: 'Compare sectors' },
                  { href: '/calculator', label: 'Cost calculator' },
                  { href: '/checklist', label: 'Setup checklist' },
                  { href: '/wizard', label: 'Sector wizard' },
                ]}
              />
              <FooterColumn
                title="Research"
                links={[
                  { href: '/bishoftu', label: 'Bishoftu Pulse' },
                  { href: '/blog', label: 'Writing' },
                  { href: '/about', label: 'About' },
                ]}
              />
              <FooterColumn
                title="Help"
                links={[
                  { href: '/consult', label: 'Book a consult' },
                  ...(ENABLE_ACCOUNTS ? [{ href: '/pricing', label: 'Pricing' }] : []),
                  { href: `mailto:${CONSULT_EMAIL}`, label: 'Email us' },
                ]}
              />
            </div>

            <div className="mt-12 border-t border-border pt-6 space-y-4 text-xs text-ink-faint">
              <p className="rounded-md border border-border bg-bg/60 p-3 leading-relaxed text-ink-muted">
                <strong className="text-ink">Independent civic-tech project.</strong>{' '}
                BizBridge is not affiliated with the Government of Ethiopia, the Ministry of
                Trade &amp; Regional Integration, MOR, or any official body. Sector data is
                compiled from public documents and lived experience —{' '}
                <a
                  href="https://etrade.gov.et"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand hover:underline"
                >
                  verify current rules on eTrade
                </a>{' '}
                or with a licensed lawyer before you file anything.
              </p>
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <p>© {new Date().getFullYear()} BizBridge · A personal project by Cherinet Demeke.</p>
                <p>
                  Data source:{' '}
                  <span className="font-mono text-ink-muted">MOR Directive 17/2011</span> · 519 sectors
                </p>
              </div>
            </div>
          </div>
        </footer>

        <SupportWidget />
      </div>
    </CommandPaletteProvider>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink-muted hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
