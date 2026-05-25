'use client'

import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Home, Plus } from 'lucide-react'
import Link from 'next/link'
import PropertyCard from '../_components/property-card'
import { fetchProperties, type PropertyResource } from '@/lib/property'

export default function ImoveisPage() {
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProperties({ per_page: 50 })
      .then((res) => {
        if (!cancelled) setProperties(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Erro ao carregar imóveis')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Meus Imóveis</h1>
          <p className="text-sm text-text-secondary">
            {loading ? 'Carregando...' : `${properties.length} imóveis cadastrados`}
          </p>
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
          <Link
            href="/dashboard/imoveis/novo"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            Novo Imóvel
          </Link>
          <button
            className="p-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
            aria-label="Filtrar"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="h-36 bg-tertiary" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-tertiary rounded w-3/4" />
                <div className="h-3 bg-tertiary rounded w-1/2" />
                <div className="flex gap-4">
                  <div className="h-3 bg-tertiary rounded w-16" />
                  <div className="h-3 bg-tertiary rounded w-16" />
                  <div className="h-3 bg-tertiary rounded w-16" />
                </div>
                <div className="h-8 bg-tertiary rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
            <Home size={28} />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Erro ao carregar</h3>
          <p className="text-xs text-text-secondary mb-4 text-center max-w-xs">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
            <Home size={28} />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhum imóvel cadastrado</h3>
          <p className="text-xs text-text-secondary mb-4">Você ainda não cadastrou nenhum imóvel</p>
          <Link
            href="/dashboard/imoveis/novo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Cadastrar Imóvel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
