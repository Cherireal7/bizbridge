'use client'

import * as React from 'react'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'bb.lang'
type Lang = 'EN' | 'AM'

export function LangToggle({ className }: { className?: string }) {
  const [lang, setLang] = React.useState<Lang>('EN')
  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'EN' || stored === 'AM') setLang(stored)
  }, [])
  const change = (l: Lang) => {
    setLang(l)
    window.localStorage.setItem(STORAGE_KEY, l)
    // TODO: hook to next-intl when chrome translations are added (Phase 4)
  }
  return (
    <div
      className={cn(
        'inline-flex h-8 items-center rounded-md border border-border bg-surface-2 p-0.5 text-xs font-medium',
        className,
      )}
      role="tablist"
      aria-label="Language"
    >
      {(['EN', 'AM'] as const).map((l) => (
        <button
          key={l}
          role="tab"
          aria-selected={lang === l}
          onClick={() => change(l)}
          className={cn(
            'inline-flex h-full items-center rounded px-2.5 transition-all',
            lang === l ? 'bg-brand text-brand-foreground shadow-sm' : 'text-ink-muted hover:text-ink',
            l === 'AM' && 'font-amharic',
          )}
        >
          {l === 'AM' ? 'አማ' : 'EN'}
        </button>
      ))}
    </div>
  )
}
