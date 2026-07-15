'use client'

import { Card } from '@/components/ui/card'
import { Chart } from '@/components/charts/chart'

interface PulseChartsProps {
  trending: { label: string; value: number }[]
  phases: readonly { phase: string; start: string; end: string; status: string }[]
  fxHistory: number[]
}

export function PulseCharts({ trending, phases, fxHistory }: PulseChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-6">
        <header className="mb-4">
          <p className="text-xs uppercase tracking-wider text-brand">Where new businesses go</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tightish">
            Bishoftu sector share, YTD
          </h3>
        </header>
        <Chart
          type="donut"
          height={300}
          series={trending.map((t) => t.value)}
          options={{
            labels: trending.map((t) => t.label),
            plotOptions: {
              pie: {
                donut: {
                  size: '68%',
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total',
                      formatter: () => `${trending.reduce((a, b) => a + b.value, 0)}%`,
                    },
                  },
                },
              },
            },
            legend: {
              position: 'bottom',
              fontSize: '12px',
            },
            stroke: { width: 0 },
          }}
        />
      </Card>

      <Card className="p-6">
        <header className="mb-4">
          <p className="text-xs uppercase tracking-wider text-accent">
            Airport project · phase timeline
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tightish">
            2026 → 2030 · $12.5B build
          </h3>
        </header>
        <Chart
          type="rangeBar"
          height={300}
          series={[
            {
              name: 'Phase',
              data: phases.map((p) => ({
                x: p.phase,
                y: [new Date(p.start).getTime(), new Date(p.end).getTime()],
                fillColor:
                  p.status === 'active' ? 'rgb(var(--brand))' : 'rgb(var(--brand) / 0.45)',
              })),
            },
          ]}
          options={{
            plotOptions: {
              bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '60%',
                rangeBarGroupRows: true,
              },
            },
            xaxis: { type: 'datetime' },
            tooltip: {
              custom: (ctx) => {
                type Point = { x: string; y: [number, number] }
                const series = (ctx.w?.config?.series ?? []) as Array<{ data: Point[] }>
                const point = series[ctx.seriesIndex]?.data?.[ctx.dataPointIndex]
                if (!point) return ''
                const fmt = (t: number) =>
                  new Date(t).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                return `<div class="px-2 py-1.5 text-xs"><strong>${point.x}</strong><br/>${fmt(point.y[0])} → ${fmt(point.y[1])}</div>`
              },
            },
          }}
        />
      </Card>

      <Card className="p-6 lg:col-span-2">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-warn">FX trend</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tightish">
              ETB / USD · indicative interbank
            </h3>
          </div>
          <p className="text-xs text-ink-faint">9-week rolling · 1 USD =</p>
        </header>
        <Chart
          type="area"
          height={260}
          series={[{ name: 'ETB/USD', data: fxHistory }]}
          options={{
            xaxis: {
              categories: ['W-8', 'W-7', 'W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'Now'],
            },
            yaxis: {
              labels: { formatter: (v) => `Br ${v.toFixed(1)}` },
            },
            fill: {
              type: 'gradient',
              gradient: { opacityFrom: 0.35, opacityTo: 0 },
            },
            stroke: { curve: 'smooth', width: 2 },
            colors: ['rgb(var(--chart-3))'],
            markers: { size: 4, strokeColors: 'rgb(var(--bg))', strokeWidth: 2 },
          }}
        />
      </Card>
    </div>
  )
}
