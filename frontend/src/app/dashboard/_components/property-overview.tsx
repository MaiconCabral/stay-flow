'use client'

import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export interface PropertySummary {
  id: number
  name: string
  location: string
  coverImage: string | null
  rating: number
  revenue: number
  bookings: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const bgColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

function getColor(index: number) {
  return bgColors[index % bgColors.length]
}

export default function PropertyOverview({ properties }: { properties: PropertySummary[] }) {
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
      {properties.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-6">Nenhum imóvel encontrado</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {properties.map((property, idx) => (
            <div
              key={property.id}
              className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary-light/30 transition-all duration-150"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${getColor(idx)}`}
              >
                {property.coverImage ? (
                  <img
                    src={property.coverImage}
                    alt={property.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">{getInitials(property.name)}</span>
                )}
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
                  {property.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-xs font-medium text-amber-500 flex-shrink-0">
                      <Star size={12} />
                      {property.rating.toFixed(1)}
                    </div>
                  )}
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
      )}
    </div>
  )
}
