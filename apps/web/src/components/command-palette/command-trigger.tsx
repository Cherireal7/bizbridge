'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * The header pill that visually hints "Cmd/Ctrl+K to search". Doesn't manage
 * open state itself — the keyboard shortcut in CommandPaletteProvider does.
 * Clicking it simulates a Cmd+K keypress.
 */
export function CommandTrigger({ className }: { className?: string }) {
  const [mac, setMac] = useState(true)
  useEffect(() => {
    setMac(/Mac|iPod|iPhone|iPad/i.test(navigator.platform))
  }, [])

  const fire = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: !mac, metaKey: mac, bubbles: true })
    window.dispatchEvent(event)
  }

  return (
    <button
      type="button"
      onClick={fire}
      className={
        'group inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-sm text-ink-muted transition hover:border-brand/50 hover:text-ink ' +
        (className ?? '')
      }
      aria-label="Search sectors and navigate"
    >
      <Search className="h-4 w-4 text-ink-faint group-hover:text-brand" />
      <span className="hidden md:inline">Search sectors…</span>
      <kbd className="ml-2 hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-2xs text-ink-faint">
        {mac ? '⌘' : 'Ctrl'} K
      </kbd>
    </button>
  )
}
