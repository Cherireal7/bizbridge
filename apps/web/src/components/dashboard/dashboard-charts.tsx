'use client'

import { Card } from '@/components/ui/card'
import { Chart } from '@/components/charts/chart'

export function DashboardActivityChart() {
  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-wider text-brand">Your activity</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tightish">
          Sector views · last 14 days
        </h3>
      </header>
      <Chart
        type="area"
        height={220}
        series={[
          {
            name: 'Sector views',
            data: [2, 3, 5, 4, 7, 8, 9, 11, 14, 13, 16, 18, 22, 25],
          },
        ]}
        options={{
          chart: { sparkline: { enabled: false }, toolbar: { show: false } },
          stroke: { curve: 'smooth', width: 2 },
          fill: {
            type: 'gradient',
            gradient: { opacityFrom: 0.4, opacityTo: 0 },
          },
          colors: ['rgb(var(--brand))'],
          xaxis: {
            type: 'category',
            categories: Array.from({ length: 14 }).map((_, i) => `D-${14 - i}`),
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: { labels: { style: { colors: 'rgb(var(--ink-faint))', fontSize: '10px' } } },
          grid: { borderColor: 'rgb(var(--border) / 0.4)' },
          tooltip: { y: { formatter: (v) => `${v} views` } },
          markers: { size: 0, hover: { size: 4 } },
        }}
      />
    </Card>
  )
}

export function DashboardSectorBreakdown() {
  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-wider text-brand">What you&apos;re researching</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tightish">By category</h3>
      </header>
      <Chart
        type="donut"
        height={220}
        series={[44, 28, 16, 12]}
        options={{
          labels: ['Hospitality', 'Logistics', 'F&B Manufacturing', 'Other'],
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  name: { show: false },
                  value: {
                    show: true,
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'rgb(var(--ink))',
                  },
                  total: {
                    show: true,
                    label: 'Sectors viewed',
                    formatter: () => '100',
                  },
                },
              },
            },
          },
          legend: { position: 'bottom', fontSize: '11px', labels: { colors: 'rgb(var(--ink-muted))' } },
          stroke: { width: 2, colors: ['rgb(var(--surface))'] },
          colors: [
            'rgb(var(--brand))',
            'rgb(var(--chart-2))',
            'rgb(var(--chart-4))',
            'rgb(var(--chart-5))',
          ],
        }}
      />
    </Card>
  )
}
