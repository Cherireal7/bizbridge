import * as React from 'react'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'elevated' | 'subtle' | 'ghost'

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'border border-border bg-surface',
  elevated: 'border border-border bg-surface shadow-elevated',
  subtle: 'border border-border bg-surface-2',
  ghost: 'border border-transparent bg-transparent',
}

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: Variant }
>(function Card({ className, variant = 'default', ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('rounded-lg', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  )
})

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pt-6 pb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold tracking-tightish text-ink', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm text-ink-muted', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-t border-border px-6 py-4', className)}
      {...props}
    />
  )
}
