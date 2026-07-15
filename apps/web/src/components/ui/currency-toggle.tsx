'use client'

import { useCurrency } from '@/components/providers/currency-provider'
import { cn } from '@/lib/cn'

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()
  return (
    <div
      className={cn(
        'inline-flex h-8 items-center rounded-md border border-border bg-surface-2 p-0.5 text-xs font-medium',
        className,
      )}
      role="tablist"
      aria-label="Currency"
    >
      {(['USD', 'ETB'] as const).map((c) => (
        <button
          key={c}
          role="tab"
          aria-selected={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            'inline-flex h-full items-center rounded px-2.5 transition-all',
            currency === c
              ? 'bg-brand text-brand-foreground shadow-sm'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
