'use client'

import { Card } from '@/components/ui/card'
import { Chart } from '@/components/charts/chart'

interface CategoryCount {
  id: string | number
  slug: string
  name: string
  total: number
}

interface HomeChartsProps {
  categories: CategoryCount[]
}

const GROWTH_MOCK = {
  years: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
  series: [
    { name: 'Hospitality · F&B', data: [120, 144, 175, 220, 290, 360, 430] },
    { name: 'Construction & Materials', data: [80, 96, 130, 180, 260, 320, 380] },
    { name: 'Logistics & Storage', data: [40, 52, 70, 105, 160, 220, 280] },
  ],
}

const MOCK_CATEGORIES: CategoryCount[] = [
  { id: 1, slug: 'agriculture-hunting-forestry-fishing', name: 'Agriculture & Fishing', total: 17 },
  { id: 2, slug: 'mining-and-quarrying', name: 'Mining & Quarrying', total: 9 },
  { id: 3, slug: 'manufacturing', name: 'Manufacturing', total: 89 },
  { id: 4, slug: 'electricity-gas-water-waste', name: 'Utilities & Waste', total: 9 },
  { id: 5, slug: 'construction', name: 'Construction', total: 5 },
  { id: 6, slug: 'wholesale-retail-hotels-import-export', name: 'Wholesale & Retail', total: 233 },
  { id: 7, slug: 'transport-storage-communication', name: 'Transport & Storage', total: 25 },
  { id: 8, slug: 'finance-insurance-real-estate-business', name: 'Finance & Business', total: 76 },
  { id: 9, slug: 'community-social-personal-services', name: 'Community & Personal', total: 56 },
]

export function HomeCharts({ categories }: HomeChartsProps) {
  const safe = categories.length > 0 ? categories : MOCK_CATEGORIES
  const labels = safe.map((c) => c.name)
  const values = safe.map((c) => c.total)
  const totalSectors = values.reduce((a, b) => a + b, 0)
  const top5 = [...safe].sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 sm:p-6 lg:col-span-3">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-wider text-brand">Sector distribution</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tightish">
              Across all 9 categories
            </h3>
          </header>
          <Chart
            type="donut"
            height={360}
            series={values}
            options={{
              labels,
              plotOptions: {
                pie: {
                  donut: {
                    size: '70%',
                    labels: {
                      show: true,
                      name: { show: true, fontSize: '12px', color: 'rgb(var(--ink-muted))' },
                      value: {
                        show: true,
                        fontSize: '24px',
                        fontWeight: 600,
                        color: 'rgb(var(--ink))',
                      },
                      total: {
                        show: true,
                        label: 'Total sectors',
                        formatter: () => totalSectors.toLocaleString(),
                      },
                    },
                  },
                  expandOnClick: true,
                },
              },
              legend: {
                position: 'bottom',
                fontSize: '12px',
                labels: { colors: 'rgb(var(--ink-muted))' },
                itemMargin: { horizontal: 8, vertical: 2 },
              },
              stroke: { width: 2, colors: ['rgb(var(--bg))'] },
              colors: [
                'rgb(var(--brand))',
                'rgb(var(--brand-strong))',
                'rgb(var(--chart-2))',
                'rgb(var(--chart-4))',
                'rgb(var(--chart-5))',
                'rgb(var(--brand) / 0.7)',
                'rgb(var(--brand-strong) / 0.7)',
                'rgb(var(--chart-2) / 0.7)',
                'rgb(var(--chart-4) / 0.6)',
              ],
              tooltip: { y: { formatter: (v) => `${v} sectors` } },
              responsive: [
                { breakpoint: 640, options: { chart: { height: 320 } } },
              ],
            }}
          />
        </Card>

        <Card className="p-5 sm:p-6 lg:col-span-2">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-wider text-brand">Concentration</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tightish">
              Top 5 by sector count
            </h3>
          </header>
          <Chart
            type="bar"
            height={360}
            series={[{ name: 'Sectors', data: top5.map((c) => c.total) }]}
            options={{
              chart: { toolbar: { show: false } },
              plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 4,
                  barHeight: '65%',
                  distributed: true,
                  dataLabels: { position: 'top' },
                },
              },
              dataLabels: {
                enabled: true,
                offsetX: 6,
                style: { fontWeight: 600, colors: ['rgb(var(--ink))'] },
                formatter: (v) => `${v}`,
              },
              xaxis: {
                categories: top5.map((c) => c.name),
                labels: { show: false },
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: {
                labels: {
                  style: { colors: 'rgb(var(--ink))', fontSize: '12px', fontWeight: 500 },
                },
              },
              grid: { show: false },
              legend: { show: false },
              tooltip: { y: { formatter: (v) => `${v} sectors` } },
              colors: [
                'rgb(var(--brand))',
                'rgb(var(--brand) / 0.85)',
                'rgb(var(--brand) / 0.7)',
                'rgb(var(--brand) / 0.55)',
                'rgb(var(--brand) / 0.4)',
              ],
            }}
          />
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand">Growth trajectory</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tightish">
              Projected new-business registrations · 2024–2030
            </h3>
          </div>
          <span className="text-2xs uppercase tracking-wider text-ink-faint">
            Indicative · airport-anchored
          </span>
        </header>
        <Chart
          type="area"
          height={320}
          series={GROWTH_MOCK.series}
          options={{
            xaxis: { categories: GROWTH_MOCK.years },
            stroke: { curve: 'smooth', width: 2 },
            fill: {
              type: 'gradient',
              gradient: { opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] },
            },
            colors: [
              'rgb(var(--brand))',
              'rgb(var(--chart-2))',
              'rgb(var(--chart-4))',
            ],
            legend: { position: 'top', horizontalAlign: 'left' },
            yaxis: {
              labels: { formatter: (v) => `${v}` },
              title: { text: 'Registrations / yr', style: { color: 'rgb(var(--ink-faint))' } },
            },
            tooltip: { shared: true, y: { formatter: (v) => `${v} new businesses` } },
            markers: { size: 0, hover: { size: 5 } },
          }}
        />
      </Card>
    </div>
  )
}
