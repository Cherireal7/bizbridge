import { cn } from '@/lib/cn'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2',
        'bg-[length:200%_100%] animate-shimmer',
        className,
      )}
      {...props}
    />
  )
}
