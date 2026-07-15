'use client'

import { useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SupportWidgetProps {
  whatsapp?: string // e.g. "+251911000000"
  telegram?: string // e.g. "bizbridge_et"
}

export function SupportWidget({
  whatsapp = '+251000000000',
  telegram = 'bizbridge_et',
}: SupportWidgetProps) {
  const [open, setOpen] = useState(false)

  const whatsappHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
  const telegramHref = `https://t.me/${telegram.replace(/^@/, '')}`

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      {open ? (
        <div
          className={cn(
            'mb-3 w-72 overflow-hidden rounded-lg border border-border bg-surface shadow-elevated',
            'animate-fade-in',
          )}
        >
          <div className="border-b border-border bg-surface-2 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Talk to a human</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Reply usually within an hour during Bishoftu business hours.
            </p>
          </div>
          <div className="grid gap-1 p-2 text-sm">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded px-3 py-2.5 hover:bg-surface-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-success/15 text-success">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink">WhatsApp</p>
                <p className="text-xs text-ink-muted">Voice notes welcome</p>
              </div>
            </a>
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded px-3 py-2.5 hover:bg-surface-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/15 text-brand">
                <Send className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink">Telegram</p>
                <p className="text-xs text-ink-muted">@{telegram}</p>
              </div>
            </a>
          </div>
        </div>
      ) : null}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full border border-border bg-brand text-brand-foreground shadow-elevated',
          'transition-transform hover:scale-105 active:scale-95',
        )}
        aria-label={open ? 'Close support' : 'Open support'}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  )
}
