'use client'

import { SlidersHorizontal } from 'lucide-react'
import { categories } from './categories'

interface Props {
  activeCategory: string
  onCategoryChange: (key: string) => void
  showFilters: boolean
  onToggleFilters: () => void
}

export function CategoryFilters({ activeCategory, onCategoryChange, showFilters, onToggleFilters }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
            activeCategory === cat.key
              ? 'bg-primary text-white'
              : 'bg-card text-text-secondary border border-border hover:bg-surface hover:text-text-primary'
          }`}
        >
          {cat.label}
        </button>
      ))}
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 border ${
          showFilters
            ? 'bg-primary text-white border-primary'
            : 'bg-card text-text-secondary border-border hover:bg-surface hover:text-text-primary'
        }`}
      >
        <SlidersHorizontal size={14} />
        Filtros
      </button>
    </div>
  )
}
