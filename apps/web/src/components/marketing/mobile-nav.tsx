'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CurrencyToggle } from '@/components/ui/currency-toggle'
import { LangToggle } from '@/components/ui/lang-toggle'
import { cn } from '@/lib/cn'
import { ENABLE_ACCOUNTS } from '@/lib/flags'

interface MobileNavProps {
  nav: { href: string; label: string }[]
  className?: string
}

export function MobileNav({ nav, className }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-surface-2',
            className,
          )}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0 flex flex-col">
        <div className="border-b border-border px-6 py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 font-semibold tracking-tightish"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-strong text-brand-foreground text-sm">
              B
            </span>
            BizBridge
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-3 h-px bg-border" />
          <Link
            href="/lookup"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            MOR Lookup
          </Link>
          <Link
            href="/calculator"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Cost Calculator
          </Link>
          <Link
            href="/checklist"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Setup Checklist
          </Link>
          <Link
            href="/compare"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Compare
          </Link>
          <Link
            href="/wizard"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Sector wizard
          </Link>
        </nav>
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CurrencyToggle className="flex-1" />
            <LangToggle />
          </div>
          {ENABLE_ACCOUNTS ? (
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="secondary" size="sm" onClick={() => setOpen(false)}>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" onClick={() => setOpen(false)}>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="w-full" onClick={() => setOpen(false)}>
              <Link href="/consult">Book a consult</Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
