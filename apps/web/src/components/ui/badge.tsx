import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-surface-3 text-ink-muted',
        brand: 'bg-brand/10 text-brand ring-1 ring-inset ring-brand/20',
        accent: 'bg-accent/15 text-accent ring-1 ring-inset ring-accent/30',
        success: 'bg-success/15 text-success ring-1 ring-inset ring-success/30',
        warn: 'bg-warn/15 text-warn ring-1 ring-inset ring-warn/30',
        danger: 'bg-danger/15 text-danger ring-1 ring-inset ring-danger/30',
        outline: 'border border-border-strong text-ink-muted',
        mono: 'bg-surface-3 text-ink-muted font-mono normal-case tracking-tight',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
