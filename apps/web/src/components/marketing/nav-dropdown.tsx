'use client'

import Link from 'next/link'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface NavDropdownItem {
  href: string
  label: string
  description?: string
}

export function NavDropdown({
  label,
  items,
}: {
  label: string
  items: NavDropdownItem[]
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }, [cancelClose])

  const openNow = useCallback(() => {
    cancelClose()
    setOpen(true)
  }, [cancelClose])

  // Close whenever the route changes — avoids the popover lingering after nav.
  useEffect(() => {
    setOpen(false)
    cancelClose()
  }, [pathname, cancelClose])

  useEffect(() => () => cancelClose(), [cancelClose])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
          onFocus={openNow}
          className={cn(
            'group inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-mono text-[12px] tracking-tight transition-colors',
            open
              ? 'bg-surface text-ink'
              : 'text-ink-muted hover:bg-surface hover:text-ink',
          )}
        >
          {label}
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              open ? 'rotate-180 text-ink' : 'text-ink-faint',
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="z-40 w-72 rounded-xl border border-border/70 bg-bg/95 p-1.5 shadow-elevated backdrop-blur-xl focus:outline-none data-[state=open]:animate-none"
        >
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.href}>
                <Popover.Close asChild>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 outline-none transition-colors hover:bg-surface focus-visible:bg-surface"
                  >
                    <span className="block font-mono text-[12px] text-ink">
                      {item.label.toLowerCase()}
                    </span>
                    {item.description ? (
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">
                        {item.description}
                      </p>
                    ) : null}
                  </Link>
                </Popover.Close>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
