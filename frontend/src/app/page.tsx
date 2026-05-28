'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, CalendarDays, X, Loader2 } from 'lucide-react'
import PublicHeader from './_components/public-header'
import PublicFooter from './_components/public-footer'
import { fetchProperties, type PropertyResource } from '@/lib/property'
import { fetchLocations, type LocationResult } from '@/lib/location'
import { PropertyCard } from './_components/property-card'
import { CategoryFilters } from './_components/category-filters'
import { PropertyFilters, type FilterValues } from './_components/property-filters'
import { categoryKeywords } from './_components/categories'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchKey, setSearchKey] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterBedrooms, setFilterBedrooms] = useState('')
  const [filterGuests, setFilterGuests] = useState('')
  const [filterSort, setFilterSort] = useState('created_at')
  const [filterDir, setFilterDir] = useState('desc')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLInputElement>(null)
  const suggestDebounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const buildParams = useCallback((pageNum: number) => {
    const params: Record<string, unknown> = { status: 'available', per_page: 12, page: pageNum }
    if (searched && destination) {
      if (selectedCity && selectedState) {
        params.city = selectedCity
        params.state = selectedState
      } else {
        params.search = destination
      }
    }
    if (searched && checkIn) params.check_in = checkIn
    if (searched && checkOut) params.check_out = checkOut
    if (filterType) params.property_type = filterType
    if (filterPriceMin) params.price_min = Number(filterPriceMin)
    if (filterPriceMax) params.price_max = Number(filterPriceMax)
    if (filterBedrooms) params.bedrooms = Number(filterBedrooms)
    if (filterGuests) params.max_guests = Number(filterGuests)
    params.sort_field = filterSort
    params.sort_direction = filterDir
    return params
  }, [searched, destination, selectedCity, selectedState, checkIn, checkOut, filterType, filterPriceMin, filterPriceMax, filterBedrooms, filterGuests, filterSort, filterDir])

  useEffect(() => {
    let cancelled = false
    setHasMore(false)
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
  }, [searchKey, buildParams])

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

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = Math.floor(properties.length / 12) + 1
    const params = buildParams(nextPage)
    try {
      const res = await fetchProperties(params as Parameters<typeof fetchProperties>[0])
      setProperties(prev => [...prev, ...res.data])
      setHasMore(res.meta.current_page < res.meta.last_page)
    } catch {
      // silent
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, properties.length, buildParams])

  const loadMoreRef = useRef(loadMore)
  loadMoreRef.current = loadMore

  useEffect(() => {
    if (!hasMore || loadingMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMoreRef.current() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore])

  // Autocomplete debounce
  useEffect(() => {
    if (!destination || destination.length < 2) {
      setSuggestions([])
      setSuggestionsOpen(false)
      return
    }
    clearTimeout(suggestDebounce.current)
    setSuggestionsLoading(true)
    suggestDebounce.current = setTimeout(async () => {
      try {
        const result = await fetchLocations(destination)
        setSuggestions(result)
        setSuggestionsOpen(result.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setSuggestionsLoading(false)
      }
    }, 300)
    return () => clearTimeout(suggestDebounce.current)
  }, [destination])

  const handleSearch = useCallback(() => {
    if (!destination.trim()) return
    setSearched(true)
    setSearchKey((k) => k + 1)
    setActiveCategory('all')
    setSuggestionsOpen(false)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [destination])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }, [handleSearch])

  // Reset to "all" when search terms change
  useEffect(() => {
    if (searched && !destination) {
      setSearched(false)
    }
  }, [searched, destination])

  const today = new Date().toISOString().split('T')[0]

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

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[70vh] bg-gradient-to-br from-[#1d2639] to-[#465975] flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-full opacity-80 pointer-events-none">
            <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="500" cy="80" r="45" stroke="white" strokeWidth="2" className="opacity-60" />
              <circle cx="500" cy="80" r="30" stroke="white" strokeWidth="1.5" className="opacity-40" />
              <circle cx="500" cy="80" r="15" fill="white" className="opacity-30" />
              <path d="M380 140 Q390 130 400 135 Q410 125 425 130 Q440 120 450 135 Q465 130 470 140" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-30" />
              <path d="M150 180 Q160 170 170 175 Q180 165 195 170 Q210 160 220 175 Q235 170 240 180" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-25" />
              <g className="opacity-60">
                <path d="M120 420 Q115 350 125 300 Q130 280 120 260" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M120 260 Q100 240 80 250" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M120 260 Q110 230 105 220" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M120 260 Q135 235 150 240" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M120 260 Q140 245 155 255" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M120 260 Q95 250 85 265" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </g>
              <g className="opacity-60">
                <path d="M480 430 Q475 360 485 310 Q490 290 480 270" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M480 270 Q460 250 440 260" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M480 270 Q470 240 465 230" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M480 270 Q495 245 510 250" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M480 270 Q500 255 515 265" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M480 270 Q455 260 445 275" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </g>
              <g className="opacity-80">
                <rect x="220" y="260" width="160" height="130" rx="4" stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.08" />
                <rect x="235" y="310" width="40" height="50" rx="2" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.1" />
                <rect x="285" y="300" width="30" height="40" rx="2" stroke="white" strokeWidth="2" />
                <rect x="325" y="310" width="40" height="50" rx="2" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.1" />
                <rect x="285" y="350" width="30" height="40" rx="2" stroke="white" strokeWidth="1.5" />
                <rect x="290" y="290" width="18" height="30" rx="9" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15" />
                <path d="M210 260 L300 210 L390 260" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.05" />
                <rect x="340" y="220" width="15" height="30" rx="1" stroke="white" strokeWidth="2" />
                <path d="M347 220 Q350 210 347 200 Q344 190 347 180" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
              </g>
              <path d="M0 420 Q150 400 300 415 Q450 430 600 410" stroke="white" strokeWidth="2" className="opacity-40" />
              <path d="M0 435 Q150 420 300 430 Q450 445 600 425" stroke="white" strokeWidth="1.5" className="opacity-25" />
              <path d="M0 450 Q50 440 100 450 Q150 460 200 450 Q250 440 300 450 Q350 460 400 450 Q450 440 500 450 Q550 460 600 450" stroke="white" strokeWidth="1.5" className="opacity-20" />
              <path d="M0 465 Q50 455 100 465 Q150 475 200 465 Q250 455 300 465 Q350 475 400 465 Q450 455 500 465 Q550 475 600 465" stroke="white" strokeWidth="1" className="opacity-10" />
              <path d="M420 150 Q430 140 440 150" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
              <path d="M445 140 Q455 130 465 140" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-30" />
              <path d="M400 160 Q408 152 416 160" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-25" />
            </svg>
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-6 py-24 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Encontre o lugar perfeito para sua próxima aventura
              </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-xl">
                Milhares de imóveis em todo o Brasil para você e sua família aproveitarem momentos inesquecíveis.
              </p>
            </div>

            <div className="mt-8 lg:mt-10 w-full max-w-3xl">
              <div className="bg-card rounded-xl p-2 shadow-xl border border-white/10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                      <MapPin size={16} className="text-text-secondary flex-shrink-0" />
                      <input
                        ref={destRef}
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true) }}
                        onBlur={() => setTimeout(() => setSuggestionsOpen(false), 200)}
                        onKeyDown={handleKeyDown}
                        placeholder="Para onde vai?"
                        className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary"
                      />
                      {destination && (
                        <button onClick={() => { setDestination(''); setSelectedCity(''); setSelectedState(''); setSuggestionsOpen(false) }} className="shrink-0 text-text-secondary hover:text-text-primary transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    {/* Autocomplete dropdown */}
                    {suggestionsOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                        {suggestionsLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 size={16} className="animate-spin text-text-secondary" />
                          </div>
                        ) : (
                          suggestions.map((loc) => (
                            <button
                              key={`${loc.city}-${loc.state}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                setDestination(`${loc.city}, ${loc.state}`)
                                setSelectedCity(loc.city)
                                setSelectedState(loc.state)
                                setSuggestionsOpen(false)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left"
                            >
                              <MapPin size={14} className="text-text-secondary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {loc.city}, {loc.state}
                                </p>
                              </div>
                              <span className="text-xs text-text-secondary shrink-0 whitespace-nowrap">
                                {loc.property_count} {loc.property_count === 1 ? 'imóvel' : 'imóveis'}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                    <CalendarDays size={16} className="text-text-secondary flex-shrink-0" />
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        if (checkOut && e.target.value >= checkOut) setCheckOut('')
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent border-none outline-none text-sm text-text-primary [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                    <CalendarDays size={16} className="text-text-secondary flex-shrink-0" />
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => setCheckOut(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent border-none outline-none text-sm text-text-primary [color-scheme:dark]"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs text-white/50 mr-1 self-center">Populares:</span>
              {['Praia', 'Montanha', 'Centro', 'Luxo', 'Chalé', 'Studio'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveCategory(tag)}
                  className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filters + Listing */}
        <section ref={resultsRef} className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {searched && destination ? `Imóveis em ${destination}` : 'Imóveis em destaque'}
              </h2>
              <p className="text-sm text-text-secondary">
                {loading ? 'Carregando...' : `${filtered.length} imóveis disponíveis`}
              </p>
            </div>
            <CategoryFilters
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters((v) => !v)}
            />
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
              <p className="text-xs text-text-secondary mb-4">Nenhum imóvel disponível para esta categoria</p>
              <button
                onClick={() => setActiveCategory('all')}
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
                <div ref={sentinelRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <Loader2 size={20} className="animate-spin text-text-secondary" />
                  )}
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
