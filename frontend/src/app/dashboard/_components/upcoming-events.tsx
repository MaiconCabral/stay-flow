'use client'

import { LogIn, LogOut } from 'lucide-react'

export interface EventData {
  id: string | number
  guest: string
  property: string
  date: string
  type: 'checkin' | 'checkout'
}

export default function UpcomingEvents({ events }: { events: EventData[] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-4">Próximos Eventos</h2>
      <div className="space-y-3">
        {events.map((event) => {
          const isCheckin = event.type === 'checkin'
          const date = new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isCheckin ? 'bg-success/10 text-success' : 'bg-primary-light text-primary'
                }`}
              >
                {isCheckin ? <LogIn size={16} /> : <LogOut size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{event.guest}</p>
                <p className="text-xs text-text-secondary truncate">{event.property}</p>
              </div>
              <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
                {date}
              </span>
            </div>
          )
        })}
      </div>
      {events.length === 0 && (
        <p className="text-sm text-text-secondary text-center py-6">
          Nenhum evento nos próximos dias
        </p>
      )}
    </div>
  )
}
