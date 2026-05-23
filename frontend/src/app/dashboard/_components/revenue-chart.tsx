'use client'

import { monthlyRevenue } from '@/lib/dashboard-data'

const CHART_HEIGHT = 200
const BAR_WIDTH = 32
const BAR_GAP = 24
const CHART_WIDTH = monthlyRevenue.length * (BAR_WIDTH + BAR_GAP) + 40

export default function RevenueChart() {
  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue))
  const chartData = monthlyRevenue.map((d) => ({
    ...d,
    height: (d.revenue / maxRevenue) * (CHART_HEIGHT - 40),
  }))

  const summary = `Receita mensal: ${chartData.map((d) => `${d.month}: R$ ${(d.revenue / 1000).toFixed(1)}k`).join(', ')}`

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Receita Mensal</h2>
          <p className="text-xs text-text-secondary mt-0.5">Últimos 6 meses</p>
        </div>
        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
          +12.5%
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={summary}
          className="min-w-full"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 20 + (CHART_HEIGHT - 40) * (1 - ratio)
            return (
              <g key={ratio}>
                <line
                  x1={30}
                  y1={y}
                  x2={CHART_WIDTH - 10}
                  y2={y}
                  stroke="var(--color-tertiary)"
                  strokeWidth={1}
                />
                <text x={28} y={y + 4} textAnchor="end" className="text-[10px] fill-text-secondary">
                  R${(maxRevenue * ratio / 1000).toFixed(0)}k
                </text>
              </g>
            )
          })}

          {chartData.map((d, i) => {
            const x = 40 + i * (BAR_WIDTH + BAR_GAP)
            const y = CHART_HEIGHT - 20 - d.height
            return (
              <g key={d.month}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={d.height}
                  rx={4}
                  className="fill-primary transition-all duration-300"
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-text-secondary"
                >
                  {d.month}
                </text>
                <title>{`${d.month}: R$ ${(d.revenue / 1000).toFixed(1)}k`}</title>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
