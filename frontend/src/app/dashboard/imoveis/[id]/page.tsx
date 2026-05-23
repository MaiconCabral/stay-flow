import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Users, Bed, Bath, DollarSign, CalendarCheck, TrendingUp, MessageSquare } from 'lucide-react'
import { properties, recentBookings, upcomingEvents, statusStyles, propertyRevenue, getPropertyColor } from '@/lib/dashboard-data'

function RevenueChart({ propertyId }: { propertyId: string }) {
  const data = propertyRevenue[propertyId]
  if (!data) return null

  const maxRevenue = Math.max(...data.map((d) => d.revenue))
  const CHART_HEIGHT = 200
  const BAR_WIDTH = 32
  const BAR_GAP = 24
  const CHART_WIDTH = data.length * (BAR_WIDTH + BAR_GAP) + 40

  const chartData = data.map((d) => ({
    ...d,
    height: (d.revenue / maxRevenue) * (CHART_HEIGHT - 40),
  }))

  return (
    <svg
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="img"
      aria-label={`Receita mensal do imóvel`}
      className="min-w-full"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = 20 + (CHART_HEIGHT - 40) * (1 - ratio)
        return (
          <g key={ratio}>
            <line x1={30} y1={y} x2={CHART_WIDTH - 10} y2={y} stroke="var(--color-tertiary)" strokeWidth={1} />
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
            <rect x={x} y={y} width={BAR_WIDTH} height={d.height} rx={4} className="fill-primary" />
            <text x={x + BAR_WIDTH / 2} y={CHART_HEIGHT - 6} textAnchor="middle" className="text-[10px] fill-text-secondary">
              {d.month}
            </text>
            <title>{`${d.month}: R$ ${(d.revenue / 1000).toFixed(1)}k`}</title>
          </g>
        )
      })}
    </svg>
  )
}

export default async function ImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = properties.find((p) => p.id === id)

  if (!property) {
    notFound()
  }

  const propertyIndex = properties.findIndex((p) => p.id === id)
  const colorClass = getPropertyColor(propertyIndex)

  const propertyBookings = recentBookings.filter((b) => b.propertyId === id)
  const propertyEvents = upcomingEvents.filter((e) => e.propertyId === id)
  const occupancy = Math.round((property.bookings * 3 / 30) * 100)

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/imoveis"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para Imóveis
      </Link>

      {/* Header */}
      <div className={`rounded-xl overflow-hidden ${colorClass}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold">{property.name}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'active'
                      ? 'bg-success/15 text-success'
                      : 'bg-black/10 text-text-secondary'
                  }`}
                >
                  {property.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm opacity-80">
                <MapPin size={14} />
                {property.location} · {property.type}
              </p>
              <p className="mt-3 text-sm opacity-75 max-w-2xl leading-relaxed">
                {property.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-3 py-1.5 rounded-lg flex-shrink-0">
              <Star size={16} />
              {property.rating}
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Receita Total', value: `R$ ${(property.revenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-success bg-success/10' },
          { label: 'Reservas', value: String(property.bookings), icon: CalendarCheck, color: 'text-primary bg-primary-light' },
          { label: 'Ocupação', value: `${occupancy}%`, icon: TrendingUp, color: 'text-amber-600 bg-amber-100' },
          { label: 'Avaliações', value: String(property.rating), icon: Star, color: 'text-amber-600 bg-amber-100' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Details + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Detalhes</h2>
          <div className="space-y-3.5">
            {[
              { icon: Bed, label: 'Quartos', value: `${property.bedrooms} quartos` },
              { icon: Bath, label: 'Banheiros', value: `${property.bathrooms} banheiros` },
              { icon: Users, label: 'Capacidade', value: `Até ${property.maxGuests} hóspedes` },
              { icon: DollarSign, label: 'Diária', value: `R$ ${property.pricePerNight.toLocaleString('pt-BR')}` },
              { icon: MapPin, label: 'Localização', value: property.location },
              { icon: CalendarCheck, label: 'Tipo', value: property.type },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{item.label}</p>
                    <p className="text-sm font-medium text-text-primary">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Próximos Eventos</h2>
          {propertyEvents.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-6">Nenhum evento nos próximos dias</p>
          ) : (
            <div className="space-y-2">
              {propertyEvents.map((event) => {
                const date = new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                return (
                  <div key={event.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${event.type === 'checkin' ? 'bg-success/10 text-success' : 'bg-primary-light text-primary'}`}>
                      {event.type === 'checkin' ? <Users size={15} /> : <Users size={15} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{event.guest}</p>
                      <p className="text-xs text-text-secondary">{event.type === 'checkin' ? 'Check-in' : 'Check-out'}</p>
                    </div>
                    <span className="text-xs font-medium text-text-secondary whitespace-nowrap">{date}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Receita Mensal</h2>
            <p className="text-xs text-text-secondary mt-0.5">Últimos 6 meses</p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <RevenueChart propertyId={id} />
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Reservas deste Imóvel</h2>
        </div>
        {propertyBookings.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Nenhuma reserva encontrada</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspede</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-in</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-out</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">{booking.avatar}</div>
                          <span className="font-medium text-text-primary">{booking.guest}</span>
                        </div>
                      </td>
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
                      <td className="py-3 px-2 text-right font-medium text-text-primary">R$ {booking.amount.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {propertyBookings.map((booking) => (
                <div key={booking.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">{booking.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-text-primary">{booking.guest}</p>
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
          </>
        )}
      </div>
    </div>
  )
}
