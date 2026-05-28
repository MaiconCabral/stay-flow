'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { MapPin, Search, Loader2, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PublicHeader from '../../_components/public-header'
import PublicFooter from '../../_components/public-footer'
import { fetchProperties, type PropertyResource } from '@/lib/property'
import { fetchLocations, type LocationResult } from '@/lib/location'
import { PropertyCard } from '../../_components/property-card'
import { PropertyFilters, type FilterValues } from '../../_components/property-filters'
import { parseSlug } from '@/lib/slug'

export default function DestinoPage() {
  const params = useParams()
  const slug = params?.slug as string

  const parsed = useMemo(() => parseSlug(slug), [slug])

  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [allLocations, setAllLocations] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [filterType, setFilterType] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [filterBedrooms, setFilterBedrooms] = useState('')
  const [filterGuests, setFilterGuests] = useState('')
  const [filterSort, setFilterSort] = useState('created_at')
  const [filterDir, setFilterDir] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const filterValues: FilterValues = {
    filterType, filterPriceMin, filterPriceMax,
    filterBedrooms, filterGuests, filterSort, filterDir,
  }

  const onFilterChange = useCallback((field: keyof FilterValues, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      filterType: setFilterType,
      filterPriceMin: setFilterPriceMin,
      filterPriceMax: setFilterPriceMax,
      filterBedrooms: setFilterBedrooms,
      filterGuests: setFilterGuests,
      filterSort: setFilterSort,
      filterDir: setFilterDir,
    }
    setters[field]?.(value)
  }, [])

  const onClearFilters = useCallback(() => {
    setFilterType(''); setFilterPriceMin(''); setFilterPriceMax('')
    setFilterBedrooms(''); setFilterGuests('')
    setFilterSort('created_at'); setFilterDir('desc')
  }, [])

  useEffect(() => {
    if (!parsed) { setNotFound(true); setLoading(false); return }
    let cancelled = false
    setLoading(true); setNotFound(false); setPage(1); setHasMore(false)

    Promise.all([
      fetchLocations(''),
      fetchProperties({ city: parsed.city, state: parsed.state, status: 'available', per_page: 12, page: 1 }),
    ]).then(([locs, res]) => {
      if (cancelled) return
      setAllLocations(locs)
      setProperties(res.data)
      setHasMore(res.meta.current_page < res.meta.last_page)
      if (res.data.length === 0) setNotFound(true)
    }).catch(() => {
      if (!cancelled) setNotFound(true)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [parsed])

  const currentLocation = useMemo(() => {
    if (!parsed) return null
    return allLocations.find((l) => l.state === parsed.state && l.city.toLowerCase() === parsed.city.toLowerCase())
  }, [allLocations, parsed])

  const buildParams = useCallback((pageNum: number) => {
    if (!parsed) return {}
    const params: Record<string, unknown> = {
      city: parsed.city, state: parsed.state, status: 'available', per_page: 12, page: pageNum,
    }
    if (filterType) params.property_type = filterType
    if (filterPriceMin) params.price_min = Number(filterPriceMin)
    if (filterPriceMax) params.price_max = Number(filterPriceMax)
    if (filterBedrooms) params.bedrooms = Number(filterBedrooms)
    if (filterGuests) params.max_guests = Number(filterGuests)
    params.sort_field = filterSort
    params.sort_direction = filterDir
    return params
  }, [parsed, filterType, filterPriceMin, filterPriceMax, filterBedrooms, filterGuests, filterSort, filterDir])

  useEffect(() => {
    if (!parsed) return
    let cancelled = false
    setPage(1); setHasMore(false)
    const params = buildParams(1)
    fetchProperties(params as Parameters<typeof fetchProperties>[0])
      .then((res) => {
        if (!cancelled) {
          setProperties(res.data)
          setHasMore(res.meta.current_page < res.meta.last_page)
        }
      })
      .catch(() => { if (!cancelled) setProperties([]) })
    return () => { cancelled = true }
  }, [parsed, buildParams])

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !parsed) return
    setLoadingMore(true)
    const nextPage = page + 1
    const params = buildParams(nextPage)
    try {
      const res = await fetchProperties(params as Parameters<typeof fetchProperties>[0])
      setProperties(prev => [...prev, ...res.data])
      setPage(nextPage)
      setHasMore(res.meta.current_page < res.meta.last_page)
    } catch {
      // silent
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page, parsed, buildParams])

  if (!parsed) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4 mx-auto">
              <Search size={28} />
            </div>
            <h1 className="text-sm font-semibold text-text-primary mb-1">Destino inválido</h1>
            <p className="text-xs text-text-secondary mb-4">O formato do destino não é válido.</p>
            <Link href="/destinos" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
              Ver todos os destinos
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Breadcrumb + Header */}
        <section className="bg-gradient-to-br from-[#1d2639] to-[#465975] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link href="/descobrir" className="hover:text-white transition-colors">Descobrir</Link>
              <ChevronRight size={10} />
              <Link href="/destinos" className="hover:text-white transition-colors">Destinos</Link>
              <ChevronRight size={10} />
              <span className="text-white/80">{parsed.city}</span>
            </nav>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-white/60" />
                  <span className="text-white/50 text-xs font-medium uppercase tracking-widest">{parsed.state}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {parsed.city}
                </h1>
                <p className="mt-2 text-white/70 text-sm">
                  {currentLocation
                    ? `${currentLocation.property_count} ${currentLocation.property_count === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}`
                    : loading ? 'Carregando...' : 'Imóveis disponíveis'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Listing */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Imóveis em {parsed.city}
              </h2>
              <p className="text-sm text-text-secondary">
                {loading ? 'Carregando...' : `${properties.length} imóveis encontrados`}
              </p>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 border ${
                showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-card text-text-secondary border-border hover:bg-surface hover:text-text-primary'
              }`}
            >
              <Search size={14} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <PropertyFilters
              values={filterValues}
              onChange={onFilterChange}
              onClear={onClearFilters}
            />
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="h-44 bg-tertiary" />
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
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                <Home size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhum imóvel encontrado</h3>
              <p className="text-xs text-text-secondary mb-4 text-center max-w-sm">
                Não encontramos imóveis disponíveis em {parsed.city}, {parsed.state}.
                {currentLocation && currentLocation.property_count > 0 ? ' Tente ajustar os filtros.' : ''}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/destinos"
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Outros destinos
                </Link>
                <button
                  onClick={onClearFilters}
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {properties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {loadingMore ? 'Carregando...' : 'Carregar mais'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
