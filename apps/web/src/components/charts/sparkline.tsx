'use client'

import { Chart } from './chart'

interface SparklineProps {
  data: number[]
  color?: 1 | 2 | 3 | 4 | 5
  height?: number
}

export function Sparkline({ data, color = 1, height = 48 }: SparklineProps) {
  return (
    <Chart
      type="area"
      height={height}
      series={[{ name: '', data }]}
      options={{
        chart: { sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
          type: 'gradient',
          gradient: { opacityFrom: 0.4, opacityTo: 0 },
        },
        colors: [`var(--chart-${color}-rgb, rgb(var(--chart-${color})))`],
      }}
    />
  )
}
