import Link from 'next/link'
import {
  Calculator,
  CheckSquare,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
} from 'lucide-react'
import { CommandPaletteProvider } from '@/components/command-palette/command-palette'
import { CommandTrigger } from '@/components/command-palette/command-trigger'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CurrencyToggle } from '@/components/ui/currency-toggle'
import { Button } from '@/components/ui/button'

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/sectors', label: 'Sectors', icon: ListChecks },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/checklist', label: 'Checklists', icon: CheckSquare },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/experts', label: 'Experts', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <div className="flex min-h-screen bg-bg">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <div className="border-b border-border p-5">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tightish"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-brand to-brand-strong text-brand-foreground text-sm">
                B
              </span>
              BizBridge
            </Link>
          </div>
          <nav className="flex-1 space-y-0.5 p-3 text-sm">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-border p-3 text-xs text-ink-faint">
            <Link href="/" className="flex items-center gap-2 hover:text-ink">
              <Home className="h-3.5 w-3.5" /> Marketing site
            </Link>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-6 backdrop-blur-md">
            <CommandTrigger className="hidden md:inline-flex" />
            <div className="ml-auto flex items-center gap-2">
              <CurrencyToggle className="hidden md:inline-flex" />
              <ThemeToggle />
              <Button asChild size="sm" variant="ghost">
                <Link href="/settings">Account</Link>
              </Button>
            </div>
          </header>
          <div className="px-6 py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </CommandPaletteProvider>
  )
}
