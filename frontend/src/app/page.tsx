'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, MapPin, Star, Users, Bed, Bath, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import PublicHeader from './_components/public-header'
import PublicFooter from './_components/public-footer'
import { fetchProperties, type PropertyResource } from '@/lib/property'

const categories = [
  { key: 'all', label: 'Todos' },
  { key: 'Praia', label: 'Praia' },
  { key: 'Montanha', label: 'Montanha' },
  { key: 'Centro', label: 'Centro' },
  { key: 'Cobertura', label: 'Cobertura' },
  { key: 'Sítio', label: 'Sítio' },
  { key: 'Chalé', label: 'Chalé' },
  { key: 'Studio', label: 'Studio' },
]

const categoryKeywords: Record<string, string[]> = {
  Praia: ['Praia', 'praia', 'Ubatuba', 'praia', 'beach'],
  Montanha: ['Montanha', 'montanha', 'Serra', 'serra', 'Campos do Jordão', 'montanha'],
  Centro: ['Centro', 'centro', 'Centro Histórico'],
  Cobertura: ['Cobertura', 'cobertura'],
  Sítio: ['Sítio', 'sítio', 'Sitio', 'sitio', 'Atibaia'],
  Chalé: ['Chalé', 'chalé', 'Chale', 'chale'],
  Studio: ['Studio', 'studio', 'Vila Olímpia'],
}

const bgColors = [
  'from-blue-100 to-cyan-100 text-blue-700',
  'from-emerald-100 to-teal-100 text-emerald-700',
  'from-amber-100 to-yellow-100 text-amber-700',
  'from-violet-100 to-purple-100 text-violet-700',
  'from-rose-100 to-pink-100 text-rose-700',
  'from-cyan-100 to-sky-100 text-cyan-700',
  'from-orange-100 to-amber-100 text-orange-700',
  'from-teal-100 to-green-100 text-teal-700',
]

function getColor(index: number) {
  return bgColors[index % bgColors.length]
}

function PropertyCard({ property, index }: { property: PropertyResource; index: number }) {
  const location = [property.city, property.state].filter(Boolean).join(', ')
  const initials = property.title.slice(0, 2).toUpperCase()

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className={`h-44 flex items-center justify-center bg-gradient-to-br ${getColor(index)} relative`}>
        {property.cover_image?.image_url ? (
          <img
            src={property.cover_image.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="text-5xl font-bold opacity-15 select-none">{initials}</span>
            <span className="absolute text-3xl font-bold tracking-wider opacity-70 select-none">{initials}</span>
          </>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-medium text-text-secondary flex-shrink-0">
              <Star size={12} className="text-amber-400" />
              {property.property_type_label}
            </div>
          </div>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {location || property.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Users size={13} />
            {property.max_guests} hóspedes
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

        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div>
            <p className="text-lg font-bold text-text-primary">
              R$ {property.price_per_night.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11px] text-text-secondary">por noite</p>
          </div>
          <Link
            href={`/imoveis/${property.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Detalhes
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchProperties({ status: 'available', per_page: 20 })
      .then((res) => {
        if (!cancelled) setProperties(res.data)
      })
      .catch(() => {
        if (!cancelled) setProperties([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

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

            <div className="mt-8 lg:mt-10 w-full max-w-2xl">
              <div className="bg-card rounded-xl p-2 shadow-xl border border-white/10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                    <Search size={16} className="text-text-secondary flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Para onde vai?"
                      className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                    <input
                      type="text"
                      placeholder="Check-in"
                      className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
                    <input
                      type="text"
                      placeholder="Check-out"
                      className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
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
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Imóveis em destaque</h2>
              <p className="text-sm text-text-secondary">
                {loading ? 'Carregando...' : `${filtered.length} imóveis disponíveis`}
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
            </div>
          </div>

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

              {filtered.length > 8 && (
                <div className="flex justify-center mt-10">
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card text-text-secondary text-sm font-medium hover:bg-surface hover:text-text-primary transition-colors">
                    Ver mais imóveis
                    <ChevronRight size={16} />
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
