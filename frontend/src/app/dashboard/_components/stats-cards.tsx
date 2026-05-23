import { TrendingUp, CalendarCheck, Home, MessageSquare } from 'lucide-react'
import { statsCards, type StatCard } from '@/lib/dashboard-data'

const iconMap: Record<string, React.ReactNode> = {
  'trending-up': <TrendingUp size={20} />,
  'calendar-check': <CalendarCheck size={20} />,
  'home': <Home size={20} />,
  'message-square': <MessageSquare size={20} />,
}

function StatCard({ card }: { card: StatCard }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 min-w-[200px] flex-1">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
          {iconMap[card.icon]}
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            card.trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}
        >
          <span>{card.trend === 'up' ? '↑' : '↓'}</span>
          {Math.abs(card.change)}%
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{card.value}</p>
        <p className="text-sm text-text-secondary mt-0.5">{card.label}</p>
      </div>
    </div>
  )
}

export default function StatsCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none lg:overflow-visible">
      {statsCards.map((card) => (
        <div key={card.label} className="snap-start flex-1 min-w-[200px]">
          <StatCard card={card} />
        </div>
      ))}
    </div>
  )
}
