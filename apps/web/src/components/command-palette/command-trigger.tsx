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
        'group inline-flex h-8 items-center gap-2 rounded-md border border-border/70 bg-surface/60 px-2.5 font-mono text-[11px] text-ink-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-ink ' +
        (className ?? '')
      }
      aria-label="Search sectors and navigate"
    >
      <Search className="h-3.5 w-3.5 text-ink-faint group-hover:text-ink" />
      <span className="hidden md:inline">search sectors…</span>
      <kbd className="ml-4 hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/70 bg-bg/60 px-1.5 font-mono text-[10px] text-ink-faint">
        {mac ? '⌘' : 'ctrl'} k
      </kbd>
    </button>
  )
}
