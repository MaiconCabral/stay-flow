'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, MapPin, Compass, Loader2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import PublicHeader from '../_components/public-header'
import PublicFooter from '../_components/public-footer'
import { fetchProperties, type PropertyResource } from '@/lib/property'
import { fetchLocations, type LocationResult } from '@/lib/location'
import { PropertyCard } from '../_components/property-card'
import { PropertyFilters, type FilterValues } from '../_components/property-filters'
import { categories, categoryKeywords } from '../_components/categories'
import { getColor } from '../_components/bg-colors'
import { slugify } from '@/lib/slug'

const categoryGrid = categories.filter((c) => c.key !== 'all')

const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  villa: 'Vila',
  cabin: 'Cabana',
  cottage: 'Chalé',
  loft: 'Loft',
  studio: 'Studio',
}

export default function DescobrirPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState<LocationResult[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)

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

  const buildParams = useCallback((pageNum: number) => {
    const params: Record<string, unknown> = { status: 'available', per_page: 12, page: pageNum }
    if (filterType) params.property_type = filterType
    if (filterPriceMin) params.price_min = Number(filterPriceMin)
    if (filterPriceMax) params.price_max = Number(filterPriceMax)
    if (filterBedrooms) params.bedrooms = Number(filterBedrooms)
    if (filterGuests) params.max_guests = Number(filterGuests)
    params.sort_field = filterSort
    params.sort_direction = filterDir
    return params
  }, [filterType, filterPriceMin, filterPriceMax, filterBedrooms, filterGuests, filterSort, filterDir])

  useEffect(() => {
    let cancelled = false
    setHasMore(false)
    setPage(1)
    const params = buildParams(1)
    fetchProperties(params as Parameters<typeof fetchProperties>[0])
      .then((res) => {
        if (!cancelled) {
          setProperties(res.data)
          setHasMore(res.meta.current_page < res.meta.last_page)
        }
      })
      .catch(() => { if (!cancelled) setProperties([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [buildParams])

  useEffect(() => {
    let cancelled = false
    fetchLocations('')
      .then((res) => { if (!cancelled) setLocations(res) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLocationsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cat of categoryGrid) {
      const keywords = categoryKeywords[cat.key] ?? [cat.key]
      counts[cat.key] = properties.filter((p) =>
        keywords.some((kw) =>
          p.title.toLowerCase().includes(kw.toLowerCase()) ||
          p.city.toLowerCase().includes(kw.toLowerCase()) ||
          p.state.toLowerCase().includes(kw.toLowerCase()) ||
          p.property_type_label.toLowerCase().includes(kw.toLowerCase()) ||
          p.description.toLowerCase().includes(kw.toLowerCase())
        )
      ).length
    }
    return counts
  }, [properties])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return properties
    const keywords = categoryKeywords[activeCategory] ?? [activeCategory]
    return properties.filter((p) =>
      keywords.some(
        (kw) =>
          p.title.toLowerCase().includes(kw.toLowerCase()) ||
          p.city.toLowerCase().includes(kw.toLowerCase()) ||
          p.state.toLowerCase().includes(kw.toLowerCase()) ||
          p.property_type_label.toLowerCase().includes(kw.toLowerCase()) ||
          p.description.toLowerCase().includes(kw.toLowerCase())
      )
    )
  }, [activeCategory, properties])

  const topLocations = useMemo(() => {
    return locations.slice(0, 4)
  }, [locations])

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
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
  }, [loadingMore, hasMore, page, buildParams])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1d2639] to-[#465975] py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Compass size={20} className="text-white" />
              </div>
              <span className="text-white/50 text-xs font-medium uppercase tracking-widest">Descobrir</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              Explore lugares incríveis
            </h1>
            <p className="mt-3 text-white/70 text-sm sm:text-base max-w-xl">
              Encontre inspiração para sua próxima viagem. De praias paradisíacas a refúgios na montanha.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
            {categoryGrid.map((cat, idx) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key)
                  setShowFilters(false)
                }}
                className={`relative group rounded-xl overflow-hidden p-5 h-32 sm:h-36 flex flex-col justify-between text-left transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]'
                    : 'hover:scale-[1.02]'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getColor(idx)} opacity-90`} />
                <div className="relative z-10">
                  <span className={`text-2xl font-bold ${getColor(idx).split(' ')[2]}`}>
                    {cat.label}
                  </span>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">
                    {categoryCounts[cat.key] ?? 0} imóveis
                  </span>
                  <ChevronRight size={14} className="text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Top Destinations */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Destinos em alta</h2>
              <p className="text-sm text-text-secondary">Os destinos mais procurados pelos viajantes</p>
            </div>
            <Link
              href="/destinos"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>

          {locationsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {topLocations.map((loc, idx) => (
                <Link
                  key={`${loc.city}-${loc.state}`}
                  href={`/destinos/${slugify(loc.city, loc.state)}`}
                  className={`relative rounded-xl overflow-hidden p-5 h-28 flex flex-col justify-between bg-gradient-to-br ${getColor(idx)} group hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className={getColor(idx).split(' ')[2]} />
                    <span className={`text-xs font-semibold ${getColor(idx).split(' ')[2]}`}>
                      {loc.state}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{loc.city}</h3>
                    <p className="text-xs text-text-secondary">
                      {loc.property_count} {loc.property_count === 1 ? 'imóvel' : 'imóveis'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/destinos"
            className="sm:hidden flex items-center justify-center gap-1 mt-4 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos os destinos <ChevronRight size={14} />
          </Link>
        </section>

        {/* Property Listing */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-10 lg:pb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Imóveis disponíveis</h2>
              <p className="text-sm text-text-secondary">
                {loading ? 'Carregando...' : `${filtered.length} imóveis encontrados`}
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
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
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhum imóvel encontrado</h3>
              <p className="text-xs text-text-secondary mb-4">Tente ajustar os filtros ou buscar por outra categoria</p>
              <button
                onClick={() => { setActiveCategory('all'); onClearFilters() }}
                className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((property, idx) => (
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
