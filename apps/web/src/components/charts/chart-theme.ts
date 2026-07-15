'use client'

import type { ApexOptions } from 'apexcharts'

/**
 * Returns ApexCharts options pre-themed for the current CSS variables.
 * Reads from document so it adapts to light/dark mode automatically.
 */
export function buildChartTheme(overrides?: ApexOptions): ApexOptions {
  if (typeof window === 'undefined') {
    return {
      chart: { background: 'transparent', toolbar: { show: false } },
      ...overrides,
    }
  }

  const styles = getComputedStyle(document.documentElement)
  const ink = `rgb(${styles.getPropertyValue('--ink').trim()})`
  const inkMuted = `rgb(${styles.getPropertyValue('--ink-muted').trim()})`
  const border = `rgb(${styles.getPropertyValue('--border').trim()})`
  const chart1 = `rgb(${styles.getPropertyValue('--chart-1').trim()})`
  const chart2 = `rgb(${styles.getPropertyValue('--chart-2').trim()})`
  const chart3 = `rgb(${styles.getPropertyValue('--chart-3').trim()})`
  const chart4 = `rgb(${styles.getPropertyValue('--chart-4').trim()})`
  const chart5 = `rgb(${styles.getPropertyValue('--chart-5').trim()})`

  const base: ApexOptions = {
    chart: {
      background: 'transparent',
      foreColor: inkMuted,
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 300 },
    },
    colors: [chart1, chart2, chart3, chart4, chart5],
    grid: {
      borderColor: border,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 0, right: 0 },
    },
    dataLabels: { enabled: false },
    legend: {
      labels: { colors: ink },
      itemMargin: { horizontal: 12 },
      markers: { size: 6, strokeWidth: 0 },
      fontWeight: 500,
    },
    tooltip: {
      theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
      style: { fontFamily: 'inherit', fontSize: '12px' },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      axisBorder: { color: border },
      axisTicks: { color: border },
      labels: { style: { colors: inkMuted, fontSize: '11px' } },
    },
    yaxis: {
      labels: { style: { colors: inkMuted, fontSize: '11px' } },
    },
  }

  return mergeDeep(base, overrides ?? {})
}

function mergeDeep<T extends object>(target: T, source: Partial<T>): T {
  const out = { ...target } as Record<string, unknown>
  for (const [key, value] of Object.entries(source)) {
    const existing = (target as Record<string, unknown>)[key]
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === 'object' &&
      !Array.isArray(existing)
    ) {
      out[key] = mergeDeep(existing as object, value as object)
    } else {
      out[key] = value
    }
  }
  return out as T
}
