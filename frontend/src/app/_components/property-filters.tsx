'use client'

import { RotateCcw } from 'lucide-react'
import { propertyTypeOptions } from './categories'

export interface FilterValues {
  filterType: string
  filterPriceMin: string
  filterPriceMax: string
  filterBedrooms: string
  filterGuests: string
  filterSort: string
  filterDir: string
}

interface Props {
  values: FilterValues
  onChange: (field: keyof FilterValues, value: string) => void
  onClear: () => void
}

export function PropertyFilters({ values, onChange, onClear }: Props) {
  return (
    <div className="mb-6 p-4 bg-card rounded-xl border border-border">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Tipo</label>
          <select
            value={values.filterType}
            onChange={(e) => onChange('filterType', e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Todos</option>
            {propertyTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Preço mín.</label>
          <input
            type="number"
            min={0}
            value={values.filterPriceMin}
            onChange={(e) => onChange('filterPriceMin', e.target.value)}
            placeholder="R$ 0"
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Preço máx.</label>
          <input
            type="number"
            min={0}
            value={values.filterPriceMax}
            onChange={(e) => onChange('filterPriceMax', e.target.value)}
            placeholder="R$ 9999"
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Quartos</label>
          <select
            value={values.filterBedrooms}
            onChange={(e) => onChange('filterBedrooms', e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Qualquer</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Hóspedes</label>
          <select
            value={values.filterGuests}
            onChange={(e) => onChange('filterGuests', e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">Qualquer</option>
            {[1, 2, 4, 6, 8, 10].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Ordenar</label>
          <select
            value={values.filterSort}
            onChange={(e) => onChange('filterSort', e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="created_at">Data</option>
            <option value="price_per_night">Preço</option>
            <option value="title">Título</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <select
          value={values.filterDir}
          onChange={(e) => onChange('filterDir', e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-primary outline-none"
        >
          <option value="desc">Decrescente</option>
          <option value="asc">Crescente</option>
        </select>
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <RotateCcw size={12} />
          Limpar
        </button>
      </div>
    </div>
  )
}
