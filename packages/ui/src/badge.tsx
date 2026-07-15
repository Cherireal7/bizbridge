import * as React from 'react'
import { cn } from './cn'

type Variant = 'default' | 'success' | 'warn' | 'brand'

const VARIANTS: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-700',
  warn: 'bg-amber-100 text-amber-800',
  brand: 'bg-brand-50 text-brand-700',
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
