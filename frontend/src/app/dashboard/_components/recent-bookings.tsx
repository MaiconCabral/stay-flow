import { recentBookings, statusStyles } from '@/lib/dashboard-data'

export default function RecentBookings() {
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
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">
                      {booking.avatar}
                    </div>
                    <span className="font-medium text-text-primary">{booking.guest}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-text-secondary">{booking.property}</td>
                <td className="py-3 px-2 text-text-secondary">{booking.checkIn}</td>
                <td className="py-3 px-2 text-text-secondary">{booking.checkOut}</td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                    {booking.status === 'confirmed' && 'Confirmada'}
                    {booking.status === 'pending' && 'Pendente'}
                    {booking.status === 'cancelled' && 'Cancelada'}
                    {booking.status === 'completed' && 'Concluída'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right font-medium text-text-primary">
                  R$ {booking.amount.toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {booking.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">{booking.guest}</p>
                  <p className="text-xs text-text-secondary">{booking.property}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${statusStyles[booking.status]}`}>
                  {booking.status === 'confirmed' && 'Confirmada'}
                  {booking.status === 'pending' && 'Pendente'}
                  {booking.status === 'cancelled' && 'Cancelada'}
                  {booking.status === 'completed' && 'Concluída'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                <span>{booking.checkIn} → {booking.checkOut}</span>
                <span className="font-medium text-text-primary">R$ {booking.amount.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
