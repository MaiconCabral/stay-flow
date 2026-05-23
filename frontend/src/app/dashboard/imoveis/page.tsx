import { Search, SlidersHorizontal } from 'lucide-react'
import PropertyCard from '../_components/property-card'
import { properties } from '@/lib/dashboard-data'

export default function ImoveisPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Meus Imóveis</h1>
          <p className="text-sm text-text-secondary">{properties.length} imóveis cadastrados</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-text-secondary text-sm flex-1 sm:flex-initial">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar imóvel..."
              className="bg-transparent border-none outline-none w-36 sm:w-44 text-text-primary placeholder:text-text-secondary"
            />
          </div>
          <button
            className="p-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
            aria-label="Filtrar"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} index={index} />
        ))}
      </div>
    </div>
  )
}
