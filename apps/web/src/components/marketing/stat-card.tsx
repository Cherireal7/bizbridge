import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' | 'flat' }
  visual?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, hint, trend, visual, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3 p-5', className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wider text-ink-muted">{label}</p>
        {trend ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-2xs font-medium',
              trend.direction === 'up' && 'text-success',
              trend.direction === 'down' && 'text-danger',
              trend.direction === 'flat' && 'text-ink-muted',
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {Math.abs(trend.value)}%
          </span>
        ) : null}
      </div>
      <p className="text-3xl font-semibold tracking-tightish text-ink">{value}</p>
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      {visual ? <div className="-mb-1">{visual}</div> : null}
    </Card>
  )
}
