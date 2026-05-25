'use client'

import { TrendingUp, CalendarCheck, Home, Building2 } from 'lucide-react'

export interface StatCardData {
  label: string
  value: string
  change: number
  icon: string
  trend: 'up' | 'down'
}

const iconMap: Record<string, React.ReactNode> = {
  'trending-up': <TrendingUp size={20} />,
  'calendar-check': <CalendarCheck size={20} />,
  'home': <Home size={20} />,
  'building2': <Building2 size={20} />,
}

function StatCard({ card }: { card: StatCardData }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 min-w-[200px] flex-1">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
          {iconMap[card.icon]}
        </div>
        {card.change !== 0 && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              card.trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}
          >
            <span>{card.trend === 'up' ? '↑' : '↓'}</span>
            {Math.abs(card.change)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{card.value}</p>
        <p className="text-sm text-text-secondary mt-0.5">{card.label}</p>
      </div>
    </div>
  )
}

export default function StatsCards({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none lg:overflow-visible">
      {cards.map((card) => (
        <div key={card.label} className="snap-start flex-1 min-w-[200px]">
          <StatCard card={card} />
        </div>
      ))}
    </div>
  )
}
