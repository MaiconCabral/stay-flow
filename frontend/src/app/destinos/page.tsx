'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapPin, Globe, Loader2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import PublicHeader from '../_components/public-header'
import PublicFooter from '../_components/public-footer'
import { fetchLocations, type LocationResult } from '@/lib/location'
import { getColor } from '../_components/bg-colors'
import { slugify } from '@/lib/slug'

export default function DestinosPage() {
  const [locations, setLocations] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchLocations('')
      .then((res) => { if (!cancelled) setLocations(res) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return locations
    const q = search.toLowerCase()
    return locations.filter(
      (loc) =>
        loc.city.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q)
    )
  }, [locations, search])

  const groupedByState = useMemo(() => {
    const groups: Record<string, LocationResult[]> = {}
    for (const loc of filtered) {
      if (!groups[loc.state]) groups[loc.state] = []
      groups[loc.state].push(loc)
    }
    const sortedStates = Object.keys(groups).sort()
    const result: Array<{ state: string; cities: LocationResult[] }> = []
    for (const state of sortedStates) {
      result.push({ state, cities: groups[state] })
    }
    return result
  }, [filtered])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1d2639] to-[#465975] py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <span className="text-white/50 text-xs font-medium uppercase tracking-widest">Destinos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              Explore nossos destinos
            </h1>
            <p className="mt-3 text-white/70 text-sm sm:text-base max-w-xl">
              Descubra lugares incríveis em todo o Brasil. Escolha seu destino e encontre o imóvel perfeito.
            </p>

            <div className="mt-6 max-w-md">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 border border-white/20">
                <MapPin size={16} className="text-white/50 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar destino..."
                  className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-5 w-32 bg-tertiary rounded animate-pulse mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : groupedByState.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                <MapPin size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhum destino encontrado</h3>
              <p className="text-xs text-text-secondary">
                {search ? `Nenhum destino para "${search}"` : 'Nenhum destino disponível no momento'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groupedByState.map((group) => (
                <div key={group.state}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider px-2">
                      {group.state}
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
                    {group.cities.map((loc, idx) => (
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
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
