'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { buildChartTheme } from './chart-theme'

// ApexCharts touches `window`, so SSR is disabled.
const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-md bg-surface-2" />,
})

interface ChartProps {
  type:
    | 'line'
    | 'area'
    | 'bar'
    | 'donut'
    | 'pie'
    | 'radialBar'
    | 'rangeBar'
    | 'heatmap'
    | 'scatter'
    | 'treemap'
  series: ApexOptions['series']
  options?: ApexOptions
  height?: number | string
  width?: number | string
  className?: string
}

export function Chart({ type, series, options, height = 320, width = '100%', className }: ChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const mergedOptions = useMemo(
    () => buildChartTheme(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options, resolvedTheme, mounted],
  )

  if (!mounted) {
    return <div className={className} style={{ height, width }} />
  }

  return (
    <div className={className}>
      <ApexChart type={type} series={series} options={mergedOptions} height={height} width={width} />
    </div>
  )
}
