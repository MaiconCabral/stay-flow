'use client'

import { ReservationResource } from '@/lib/reservation'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR')
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-error/10 text-error',
  completed: 'bg-primary-light text-primary-dark',
}

export default function RecentBookings({ reservations }: { reservations: ReservationResource[] }) {
  if (reservations.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Reservas Recentes</h2>
        <p className="text-sm text-text-secondary text-center py-6">Nenhuma reserva encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-4">Reservas Recentes</h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspede</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Imóvel</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-in</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-out</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">
                      {r.guest ? getInitials(r.guest.name) : '--'}
                    </div>
                    <span className="font-medium text-text-primary">{r.guest?.name ?? 'Convidado'}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-text-secondary">{r.property?.title ?? 'Imóvel'}</td>
                <td className="py-3 px-2 text-text-secondary">{formatDate(r.check_in)}</td>
                <td className="py-3 px-2 text-text-secondary">{formatDate(r.check_out)}</td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status] ?? ''}`}>
                    {r.status_label}
                  </span>
                </td>
                <td className="py-3 px-2 text-right font-medium text-text-primary">
                  R$ {formatCurrency(r.total_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {r.guest ? getInitials(r.guest.name) : '--'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">{r.guest?.name ?? 'Convidado'}</p>
                  <p className="text-xs text-text-secondary">{r.property?.title ?? 'Imóvel'}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${statusStyles[r.status] ?? ''}`}>
                  {r.status_label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                <span>{formatDate(r.check_in)} → {formatDate(r.check_out)}</span>
                <span className="font-medium text-text-primary">R$ {formatCurrency(r.total_price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
