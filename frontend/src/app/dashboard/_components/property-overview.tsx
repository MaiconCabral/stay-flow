import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { propertySummaries } from '@/lib/dashboard-data'

export default function PropertyOverview() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">Desempenho dos Imóveis</h2>
        <Link
          href="/dashboard/imoveis"
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {propertySummaries.map((property) => (
          <div
            key={property.id}
            className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary-light/30 transition-all duration-150"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-xl flex-shrink-0">
              {property.image}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{property.name}</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    <span className="truncate">{property.location}</span>
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-amber-500 flex-shrink-0">
                  <Star size={12} />
                  {property.rating}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-text-primary font-semibold">
                  R$ {(property.revenue / 1000).toFixed(1)}k
                </span>
                <span className="text-text-secondary">{property.bookings} reservas</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
