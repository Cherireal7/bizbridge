import { PARTNERS } from '@/lib/partners'
import { BrandMark } from './partner-card'

/**
 * Clean horizontal marquee of partner names — used as quiet social proof in the hero area.
 * No card wrappers, no big visual blocks. Loops seamlessly with the `ticker` keyframe.
 */
export function PartnersLogoBar() {
  const items = PARTNERS
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-ticker items-center gap-12 group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((p, i) => (
          <a
            key={`${p.slug}-${i}`}
            href={p.url}
            target="_blank"
            rel="noopener external"
            className="flex shrink-0 items-center gap-3 whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
            aria-label={`${p.name} — opens in a new tab`}
          >
            <BrandMark partner={p} size="sm" />
            <span className="text-sm font-medium tracking-tightish">{p.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

/**
 * Back-compat shim. The mid-page big-card strip is no longer rendered on the homepage —
 * the dedicated `/partners` page is where richer treatment lives.
 */
export function PartnersStrip() {
  return null
}
