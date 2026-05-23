import { MapPin, Star, Users, Bed, Bath, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import { type Property, getPropertyColor } from '@/lib/dashboard-data'

export default function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className={`h-36 flex items-center justify-center ${getPropertyColor(index)} relative`}>
        <span className="text-4xl font-bold opacity-20">{property.image}</span>
        <span className="absolute text-2xl font-bold tracking-wider">{property.image}</span>
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
              property.status === 'active'
                ? 'bg-success/15 text-success'
                : 'bg-text-secondary/15 text-text-secondary'
            }`}
          >
            {property.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{property.name}</h3>
            <div className="flex items-center gap-0.5 text-xs font-medium text-amber-600 flex-shrink-0">
              <Star size={12} />
              {property.rating}
            </div>
          </div>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {property.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Users size={13} />
            {property.maxGuests} hóspedes
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

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-lg font-bold text-text-primary">
              R$ {property.pricePerNight.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11px] text-text-secondary">por noite</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-text-primary">
              R$ {(property.revenue / 1000).toFixed(1)}k
            </p>
            <p className="text-[11px] text-text-secondary">{property.bookings} reservas</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/dashboard/imoveis/${property.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors duration-150"
          >
            <Eye size={14} />
            Ver
          </Link>
          <Link
            href={`/dashboard/imoveis/${property.id}/editar`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-surface hover:text-text-primary transition-colors duration-150"
          >
            <Pencil size={14} />
            Editar
          </Link>
        </div>
      </div>
    </div>
  )
}
