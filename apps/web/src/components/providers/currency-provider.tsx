'use client'

import * as React from 'react'

export type Currency = 'USD' | 'ETB'

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (c: Currency) => void
  /** Conversion: USD * fx = ETB */
  fxRate: number
  format: (
    amount: number,
    opts?: { currency?: Currency; compact?: boolean; sign?: boolean },
  ) => string
}

const DEFAULT_FX = 56 // synced from PricingConfig.fx_rate_birr_per_usd

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY = 'bb.currency'

export function CurrencyProvider({
  children,
  fxRate = DEFAULT_FX,
}: {
  children: React.ReactNode
  fxRate?: number
}) {
  const [currency, setCurrencyState] = React.useState<Currency>('USD')

  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    if (stored === 'USD' || stored === 'ETB') setCurrencyState(stored)
  }, [])

  const setCurrency = React.useCallback((c: Currency) => {
    setCurrencyState(c)
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, c)
  }, [])

  const format = React.useCallback<CurrencyContextValue['format']>(
    (amount, opts = {}) => {
      const c = opts.currency ?? currency
      const value = c === 'ETB' ? amount * fxRate : amount
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: c,
        notation: opts.compact ? 'compact' : 'standard',
        maximumFractionDigits: c === 'ETB' ? 0 : 2,
        signDisplay: opts.sign ? 'always' : 'auto',
      })
      return formatter.format(value)
    },
    [currency, fxRate],
  )

  const value = React.useMemo(
    () => ({ currency, setCurrency, fxRate, format }),
    [currency, setCurrency, fxRate, format],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be inside <CurrencyProvider>')
  return ctx
}
