'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Search, SlidersHorizontal, Home, Plus, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import PropertyCard from '../_components/property-card'
import { fetchProperties, type PropertyResource, type PaginationMeta } from '@/lib/property'

const propertyTypeOptions = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'villa', label: 'Vila' },
  { value: 'cabin', label: 'Cabana' },
  { value: 'cottage', label: 'Chalé' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Outro' },
]

const statusOptions = [
  { value: 'available', label: 'Disponível' },
  { value: 'unavailable', label: 'Indisponível' },
  { value: 'pending', label: 'Pendente' },
]

const sortFieldOptions = [
  { value: 'created_at', label: 'Data de cadastro' },
  { value: 'price_per_night', label: 'Preço' },
  { value: 'title', label: 'Título' },
]

interface FilterState {
  property_type: string
  status: string
  price_min: string
  price_max: string
  bedrooms: string
  max_guests: string
  sort_field: string
  sort_direction: string
}

const defaultFilters: FilterState = {
  property_type: '',
  status: '',
  price_min: '',
  price_max: '',
  bedrooms: '',
  max_guests: '',
  sort_field: 'created_at',
  sort_direction: 'desc',
}

function countActive(f: FilterState): number {
  let n = 0
  if (f.property_type) n++
  if (f.status) n++
  if (f.price_min) n++
  if (f.price_max) n++
  if (f.bedrooms) n++
  if (f.max_guests) n++
  if (f.sort_field !== 'created_at' || f.sort_direction !== 'desc') n++
  return n
}

function filtersToParams(f: FilterState): Record<string, unknown> {
  const p: Record<string, unknown> = {}
  if (f.property_type) p.property_type = f.property_type
  if (f.status) p.status = f.status
  if (f.price_min) p.price_min = Number(f.price_min)
  if (f.price_max) p.price_max = Number(f.price_max)
  if (f.bedrooms) p.bedrooms = Number(f.bedrooms)
  if (f.max_guests) p.max_guests = Number(f.max_guests)
  if (f.sort_field !== 'created_at') p.sort_field = f.sort_field
  if (f.sort_direction !== 'desc') p.sort_direction = f.sort_direction
  return p
}

export default function ImoveisPage() {
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const activeCount = countActive(filters)

  const load = useCallback(async (pageNum: number, searchTerm: string, f?: FilterState) => {
    setLoading(true)
    setError(null)
    const active = f ?? filters

    try {
      const params: Record<string, unknown> = {
        per_page: 12,
        page: pageNum,
        search: searchTerm || undefined,
        ...filtersToParams(active),
      }
      Object.keys(params).forEach((k) => { if (params[k] === undefined) delete params[k] })
      const res = await fetchProperties(params as Parameters<typeof fetchProperties>[0])
      setProperties(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr?.response?.data?.message || 'Erro ao carregar imóveis')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  // Fetch when deps change
  useEffect(() => {
    load(page, debouncedSearch)
  }, [page, debouncedSearch, load])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const openFilters = useCallback(() => {
    setDraftFilters({ ...filters })
    setFiltersOpen(true)
  }, [filters])

  const applyFilters = useCallback(() => {
    setFilters({ ...draftFilters })
    setFiltersOpen(false)
    setPage(1)
  }, [draftFilters])

  const clearFilters = useCallback(() => {
    const cleared = { ...defaultFilters }
    setDraftFilters(cleared)
    setFilters(cleared)
    setFiltersOpen(false)
    setPage(1)
  }, [])

  const clearSearch = useCallback(() => {
    setSearch('')
  }, [])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Meus Imóveis</h1>
          <p className="text-sm text-text-secondary">
            {loading ? 'Carregando...' : `${meta?.total ?? properties.length} imóveis encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-text-secondary text-sm flex-1 sm:flex-initial">
            <Search size={16} className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar imóvel..."
              className="bg-transparent border-none outline-none w-36 sm:w-44 text-text-primary placeholder:text-text-secondary min-w-0"
            />
            {search && (
              <button onClick={clearSearch} className="shrink-0 hover:text-text-primary transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <Link
            href="/dashboard/imoveis/novo"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            Novo Imóvel
          </Link>
          <button
            onClick={openFilters}
            className="relative p-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
            aria-label="Filtrar"
          >
            <SlidersHorizontal size={18} />
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.property_type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {propertyTypeOptions.find(o => o.value === filters.property_type)?.label}
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {statusOptions.find(o => o.value === filters.status)?.label}
            </span>
          )}
          {filters.price_min && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Min R$ {Number(filters.price_min).toLocaleString('pt-BR')}
            </span>
          )}
          {filters.price_max && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Max R$ {Number(filters.price_max).toLocaleString('pt-BR')}
            </span>
          )}
          {filters.bedrooms && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {filters.bedrooms}+ quartos
            </span>
          )}
          {filters.max_guests && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {filters.max_guests}+ hóspedes
            </span>
          )}
          <button
            onClick={() => { setFilters(defaultFilters); setPage(1) }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-text-secondary text-xs font-medium hover:text-text-primary transition-colors"
          >
            <RotateCcw size={12} />
            Limpar
          </button>
        </div>
      )}

      {/* Lista / estados */}
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
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            {search || activeCount > 0 ? 'Nenhum resultado encontrado' : 'Nenhum imóvel cadastrado'}
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            {search || activeCount > 0
              ? 'Tente alterar os filtros ou o termo da busca'
              : 'Você ainda não cadastrou nenhum imóvel'
            }
          </p>
          {search || activeCount > 0 ? (
            <button
              onClick={() => { setSearch(''); setFilters(defaultFilters); setPage(1) }}
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Limpar filtros
            </button>
          ) : (
            <Link
              href="/dashboard/imoveis/novo"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              Cadastrar Imóvel
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-text-secondary">
                Página {meta.current_page} de {meta.last_page} ({meta.total} imóveis)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page >= meta.last_page || loading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Filter drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Filtros</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo de Imóvel</label>
                <select
                  value={draftFilters.property_type}
                  onChange={(e) => setDraftFilters((p) => ({ ...p, property_type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Todos</option>
                  {propertyTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Status</label>
                <select
                  value={draftFilters.status}
                  onChange={(e) => setDraftFilters((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Todos</option>
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Preço mín.</label>
                  <input
                    type="number"
                    min={0}
                    value={draftFilters.price_min}
                    onChange={(e) => setDraftFilters((p) => ({ ...p, price_min: e.target.value }))}
                    placeholder="R$ 0"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Preço máx.</label>
                  <input
                    type="number"
                    min={0}
                    value={draftFilters.price_max}
                    onChange={(e) => setDraftFilters((p) => ({ ...p, price_max: e.target.value }))}
                    placeholder="R$ 9999"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Quartos (mín.)</label>
                  <select
                    value={draftFilters.bedrooms}
                    onChange={(e) => setDraftFilters((p) => ({ ...p, bedrooms: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Qualquer</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}+</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspedes (mín.)</label>
                  <select
                    value={draftFilters.max_guests}
                    onChange={(e) => setDraftFilters((p) => ({ ...p, max_guests: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Qualquer</option>
                    {[1, 2, 4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>{n}+</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Ordenar por</label>
                    <select
                      value={draftFilters.sort_field}
                      onChange={(e) => setDraftFilters((p) => ({ ...p, sort_field: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      {sortFieldOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Ordem</label>
                    <select
                      value={draftFilters.sort_direction}
                      onChange={(e) => setDraftFilters((p) => ({ ...p, sort_direction: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="desc">Decrescente</option>
                      <option value="asc">Crescente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium hover:text-text-primary hover:bg-card transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
