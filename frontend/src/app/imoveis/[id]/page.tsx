'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Star, Users, Bed, Bath, ChevronRight,
  Minus, Plus, CalendarDays, Check, MessageCircle, Share2, Heart,
  AlertCircle, Loader2, XCircle,
} from 'lucide-react'
import PublicHeader from '@/app/_components/public-header'
import PublicFooter from '@/app/_components/public-footer'
import { fetchProperty, fetchProperties, type PropertyResource } from '@/lib/property'
import { createReservation } from '@/lib/reservation'
import { checkAvailability, type CheckAvailabilityResult } from '@/lib/availability'
import { fetchPropertyReviews, type ReviewResource } from '@/lib/review'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'

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

function getColors(index: number) {
  const colors = []
  for (let i = 0; i < 5; i++) {
    colors.push(bgColors[(index + i) % bgColors.length])
  }
  return colors
}

function PriceInput({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
      <div className="relative">
        <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>
    </div>
  )
}

export default function ImovelPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { isAuthenticated } = useAuth()

  const [property, setProperty] = useState<PropertyResource | null>(null)
  const [reviews, setReviews] = useState<ReviewResource[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [related, setRelated] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const [availability, setAvailability] = useState<CheckAvailabilityResult | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (isNaN(id)) {
      setNotFoundState(true)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      fetchProperty(id),
      fetchProperties({ status: 'active', per_page: 4 }),
      fetchPropertyReviews(id),
    ])
      .then(([prop, list, rev]) => {
        if (!cancelled) {
          setProperty(prop)
          setRelated(list.data.filter((p) => p.id !== id).slice(0, 3))
          setReviews(rev.data)
          setAverageRating(rev.meta.average_rating)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setNotFoundState(true)
          } else {
            setProperty(null)
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000))
    return diff
  }, [checkIn, checkOut])

  useEffect(() => {
    if (!checkIn || !checkOut || nights === 0 || !property) {
      setAvailability(null)
      return
    }
    let cancelled = false
    setIsCheckingAvailability(true)
    checkAvailability(property.id, checkIn, checkOut)
      .then((result) => {
        if (!cancelled) setAvailability(result)
      })
      .catch(() => {
        if (!cancelled) setAvailability(null)
      })
      .finally(() => {
        if (!cancelled) setIsCheckingAvailability(false)
      })
    return () => { cancelled = true }
  }, [checkIn, checkOut, nights, property])

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/imoveis/${id}`)
      return
    }
    if (!property || !checkIn || !checkOut) return

    setBookingLoading(true)
    setBookingError(null)

    try {
      await createReservation({
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
        total_guests: guests,
      })
      setBookingSuccess(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setBookingError(axiosErr.response?.data?.message ?? 'Erro ao realizar reserva. Tente novamente.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (notFoundState) {
    notFound()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PublicHeader />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6 animate-pulse">
            <div className="h-[420px] bg-tertiary rounded-xl mb-6" />
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1 space-y-6">
                <div className="h-8 bg-tertiary rounded w-3/4" />
                <div className="h-4 bg-tertiary rounded w-1/2" />
                <div className="h-24 bg-tertiary rounded" />
              </div>
              <div className="w-full lg:w-[400px]">
                <div className="h-[400px] bg-tertiary rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PublicHeader />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
              <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Erro ao carregar imóvel</h3>
              <p className="text-xs text-text-secondary mb-4">Não foi possível carregar os dados do imóvel</p>
              <Link
                href="/"
                className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Voltar para o início
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const colors = getColors(0)
  const location = [property.city, property.state, property.country].filter(Boolean).join(', ')
  const hostName = property.host?.name || 'StayFlow'

  const subtotal = nights * property.price_per_night
  const cleaningFee = Math.round(subtotal * 0.1)
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + cleaningFee + serviceFee

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-16">
        {/* Gallery */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 rounded-xl overflow-hidden">
            <div className={`lg:col-span-2 lg:row-span-2 h-64 sm:h-80 lg:h-[420px] flex items-center justify-center bg-gradient-to-br ${colors[0]}`}>
              {property.cover_image?.image_url ? (
                <img
                  src={property.cover_image.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl sm:text-8xl font-bold opacity-30 select-none">
                  {property.title.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            {colors.slice(1, 5).map((color, i) => (
              <div key={i} className={`hidden lg:flex h-[205px] items-center justify-center bg-gradient-to-br ${color}`}>
                {property.images?.[i]?.image_url ? (
                  <img
                    src={property.images[i].image_url}
                    alt={`${property.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold opacity-15 select-none">
                    {property.title.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-surface transition-colors">
                <Share2 size={14} />
                Compartilhar
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-surface transition-colors">
                <Heart size={14} />
                Salvar
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-7">
              {/* Title / Header */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary">
                      {property.title}
                    </h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-secondary">
                      <MapPin size={14} />
                      {location} · {property.property_type_label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Host info */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {hostName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">Anfitrião: {hostName}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-surface transition-colors">
                  <MessageCircle size={14} />
                  Contatar
                </button>
              </div>

              {/* Key details */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {[
                  { icon: Users, label: 'Hóspedes', value: `Até ${property.max_guests}` },
                  { icon: Bed, label: 'Quartos', value: `${property.bedrooms} quartos` },
                  { icon: Bath, label: 'Banheiros', value: `${property.bathrooms} banheiros` },
                  { icon: MapPin, label: 'Tipo', value: property.property_type_label },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[11px] text-text-secondary">{item.label}</p>
                        <p className="text-sm font-medium text-text-primary">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="text-base font-semibold text-text-primary mb-2">Sobre este espaço</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-base font-semibold text-text-primary">Avaliações</h2>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                      <Star size={13} fill="currentColor" />
                      {averageRating.toFixed(1)}
                    </div>
                    <span className="text-xs text-text-secondary">({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})</span>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {review.guest?.name?.slice(0, 2).toUpperCase() || '??'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{review.guest?.name || 'Anônimo'}</p>
                            <p className="text-[11px] text-text-secondary">
                              {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={13}
                                className={s <= review.rating ? 'text-amber-400' : 'text-text-secondary/20'}
                                fill={s <= review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                        {review.host_reply && (
                          <div className="mt-3 pl-3 border-l-2 border-primary/30">
                            <p className="text-xs font-medium text-text-primary mb-0.5">Resposta do anfitrião</p>
                            <p className="text-xs text-text-secondary">{review.host_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Reservation Sidebar */}
            <div className="w-full lg:w-[400px] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                {bookingSuccess ? (
                  <div className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-4">
                        <Check size={28} />
                      </div>
                      <h3 className="text-base font-semibold text-text-primary mb-1">Reserva confirmada!</h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Sua reserva foi realizada com sucesso. Você pode acompanhá-la no seu painel.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/reservas?view=guest')}
                        className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Ver minhas reservas
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-sm">
                    <div className="flex items-baseline justify-between mb-5">
                      <div>
                        <span className="text-xl font-bold text-text-primary">
                          R$ {property.price_per_night.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-sm text-text-secondary"> / noite</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <PriceInput label="Check-in" value={checkIn} onChange={setCheckIn} />
                        <PriceInput label="Check-out" value={checkOut} onChange={setCheckOut} />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Hóspedes</label>
                        <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            disabled={guests <= 1}
                            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium text-text-primary">{guests} {guests === 1 ? 'hóspede' : 'hóspedes'}</span>
                          <button
                            onClick={() => setGuests(Math.min(property.max_guests, guests + 1))}
                            disabled={guests >= property.max_guests}
                            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-secondary hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {bookingError && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-error/5 border border-error/20">
                          <XCircle size={16} className="text-error flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-error">{bookingError}</p>
                        </div>
                      )}

                      {availability && !isCheckingAvailability && !availability.is_available && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <AlertCircle size={16} className="text-warning flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-warning">
                            Este imóvel não está disponível para as datas selecionadas.
                          </p>
                        </div>
                      )}

                      {isCheckingAvailability && checkIn && checkOut && (
                        <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
                          <Loader2 size={14} className="animate-spin" />
                          Verificando disponibilidade...
                        </div>
                      )}

                      <button
                        onClick={handleBooking}
                        disabled={
                          !checkIn || !checkOut || nights === 0 ||
                          bookingLoading || isCheckingAvailability ||
                          (availability !== null && !availability.is_available)
                        }
                        className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Reservando...
                          </>
                        ) : (
                          'Reservar'
                        )}
                      </button>

                      <p className="text-center text-[11px] text-text-secondary">Você só será cobrado após a confirmação</p>
                    </div>

                    {nights > 0 && (
                      <div className="mt-5 pt-4 border-t border-border space-y-2.5">
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>R$ {property.price_per_night.toLocaleString('pt-BR')} × {nights} {nights === 1 ? 'noite' : 'noites'}</span>
                          <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>Taxa de limpeza</span>
                          <span>R$ {cleaningFee.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>Taxa de serviço</span>
                          <span>R$ {serviceFee.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-text-primary pt-2.5 border-t border-border">
                          <span>Total</span>
                          <span>R$ {total.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Por que reservar no StayFlow?</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Check, text: 'Pagamento seguro com criptografia' },
                      { icon: Check, text: 'Reserva garantida pelos nossos anfitriões' },
                      { icon: MessageCircle, text: 'Suporte 24h para você e sua viagem' },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.text} className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-success/10 flex items-center justify-center text-success flex-shrink-0 mt-0.5">
                            <Icon size={13} />
                          </div>
                          <p className="text-xs text-text-secondary">{item.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Properties */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-10 lg:pb-14">
            <div className="border-t border-border pt-8 lg:pt-10">
              <h2 className="text-lg font-semibold text-text-primary mb-1">Imóveis relacionados</h2>
              <p className="text-sm text-text-secondary mb-6">Outros imóveis que você pode gostar</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((rel, idx) => {
                  const relColors = getColors(idx)
                  const relLocation = [rel.city, rel.state].filter(Boolean).join(', ')
                  return (
                    <Link
                      key={rel.id}
                      href={`/imoveis/${rel.id}`}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group block"
                    >
                      <div className={`h-40 flex items-center justify-center bg-gradient-to-br ${relColors[0]}`}>
                        {rel.cover_image?.image_url ? (
                          <img
                            src={rel.cover_image.image_url}
                            alt={rel.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold opacity-15 select-none">
                            {rel.title.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{rel.title}</h3>
                        </div>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          <MapPin size={11} />
                          {relLocation || rel.country}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span>{rel.bedrooms} quartos</span>
                          <span>·</span>
                          <span>Até {rel.max_guests} hóspedes</span>
                        </div>
                        <p className="text-sm font-bold text-text-primary pt-1 border-t border-border">
                          R$ {rel.price_per_night.toLocaleString('pt-BR')} <span className="text-xs font-normal text-text-secondary">/ noite</span>
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
