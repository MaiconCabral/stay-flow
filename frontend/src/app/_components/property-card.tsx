'use client'

import { Star, MapPin, Users, Bed, Bath, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { type PropertyResource } from '@/lib/property'
import { getColor } from './bg-colors'

export function PropertyCard({ property, index }: { property: PropertyResource; index: number }) {
  const location = [property.city, property.state].filter(Boolean).join(', ')
  const initials = property.title.slice(0, 2).toUpperCase()

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className={`h-44 flex items-center justify-center bg-gradient-to-br ${getColor(index)} relative`}>
        {property.cover_image?.image_url ? (
          <img
            src={property.cover_image.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="text-5xl font-bold opacity-15 select-none">{initials}</span>
            <span className="absolute text-3xl font-bold tracking-wider opacity-70 select-none">{initials}</span>
          </>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-medium text-text-secondary flex-shrink-0">
              <Star size={12} className="text-amber-400" />
              {property.property_type_label}
            </div>
          </div>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {location || property.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Users size={13} />
            {property.max_guests} hóspedes
          </span>
          <span className="flex items-center gap-1">
            <Bed size={13} />
            {property.bedrooms} quartos
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} />
            {property.bathrooms} banheiros
          </span>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div>
            <p className="text-lg font-bold text-text-primary">
              R$ {property.price_per_night.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11px] text-text-secondary">por noite</p>
          </div>
          <Link
            href={`/imoveis/${property.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Detalhes
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
