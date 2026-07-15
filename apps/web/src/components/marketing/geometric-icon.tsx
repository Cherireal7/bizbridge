import { cn } from '@/lib/cn'

interface GeometricIconProps {
  slug: string
  className?: string
}

/**
 * Hash-based geometric icon per sector category. No external assets;
 * built from CSS shapes + the category slug as the deterministic seed.
 */
export function GeometricIcon({ slug, className }: GeometricIconProps) {
  const variant = hash(slug) % 8

  return (
    <div
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md',
        'border border-border bg-gradient-to-br from-surface-2 to-surface',
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: glyphFor(variant) }} />
    </div>
  )
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function glyphFor(variant: number): string {
  // Brand-tinted geometric glyphs — pure CSS, no SVGs.
  const fills = [
    'conic-gradient(from 45deg at 50% 50%, rgb(var(--brand)/0.5) 0deg, rgb(var(--brand)/0.1) 90deg, rgb(var(--brand)/0.5) 180deg, rgb(var(--brand)/0.1) 270deg)',
    'linear-gradient(135deg, rgb(var(--brand)/0.5) 0%, rgb(var(--brand)/0.05) 50%, rgb(var(--accent)/0.4) 100%)',
    'radial-gradient(ellipse at 30% 30%, rgb(var(--brand)/0.5), rgb(var(--brand)/0) 60%)',
    'linear-gradient(45deg, transparent 40%, rgb(var(--brand)/0.45) 40%, rgb(var(--brand)/0.45) 60%, transparent 60%)',
    'radial-gradient(circle at 70% 70%, rgb(var(--accent)/0.5), rgb(var(--brand)/0.2) 50%, transparent 80%)',
    'conic-gradient(rgb(var(--brand)/0.4), rgb(var(--accent)/0.4), rgb(var(--brand)/0.4))',
    'linear-gradient(180deg, rgb(var(--brand)/0.4) 0%, rgb(var(--brand)/0.4) 25%, transparent 25%, transparent 50%, rgb(var(--brand)/0.4) 50%, rgb(var(--brand)/0.4) 75%, transparent 75%)',
    'repeating-linear-gradient(45deg, rgb(var(--brand)/0.3), rgb(var(--brand)/0.3) 4px, transparent 4px, transparent 8px)',
  ]
  return fills[variant] ?? fills[0]!
}
