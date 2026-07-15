import { cn } from '@/lib/cn'

/**
 * Subtle blueprint-style grid background used behind heros and major sections.
 * Two layers: faint grid lines + a soft radial spotlight in the brand color.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--brand) / 0.10), transparent 70%)',
        }}
      />
    </div>
  )
}
