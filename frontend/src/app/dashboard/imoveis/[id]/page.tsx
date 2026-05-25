'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, MapPin, Users, Bed, Bath, DollarSign, CalendarCheck,
  TrendingUp, Star, AlertCircle, Trash2, Loader2, AlertTriangle,
  LogIn, LogOut, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { fetchProperty, deleteProperty, type PropertyResource } from '@/lib/property'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'
import AvailabilityManager from '../../_components/availability-manager'
import type { AxiosError } from 'axios'

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-error/10 text-error',
  completed: 'bg-primary-light text-primary-dark',
}

export default function ImovelPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [property, setProperty] = useState<PropertyResource | null>(null)
  const [reservations, setReservations] = useState<ReservationResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (isNaN(id)) {
      setError('ID inválido')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchProperty(id),
      fetchReservations({ property_id: id, per_page: 100 }),
    ])
      .then(([prop, res]) => {
        if (!cancelled) {
          setProperty(prop)
          setReservations(res.data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            notFound()
          } else {
            setError(err?.response?.data?.message || 'Erro ao carregar imóvel')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  const allImages = useMemo(() => {
    const imgs = property?.images ?? []
    if (property?.cover_image && !imgs.some((i) => i.id === property.cover_image!.id)) {
      return [{ id: property.cover_image.id, image_url: property.cover_image.image_url, is_cover: true, order: 0 }, ...imgs]
    }
    return imgs
  }, [property])

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null)
  }, [allImages.length])
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => prev !== null ? (prev + 1) % allImages.length : null)
  }, [allImages.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, closeLightbox, prevImage, nextImage])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteProperty(id)
      router.push('/dashboard/imoveis')
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>
      setError(axiosErr.response?.data?.message ?? 'Erro ao excluir imóvel')
      setConfirmDelete(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = useMemo(() => {
    const paid = reservations.filter((r) => r.status === 'confirmed' || r.status === 'completed')
    const totalRevenue = paid.reduce((sum, r) => sum + r.total_price, 0)
    const bookingCount = paid.length

    const today = new Date().toISOString().split('T')[0]
    const next30Days: string[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      next30Days.push(d.toISOString().split('T')[0])
    }
    const bookedDays = next30Days.filter((day) =>
      paid.some((r) => r.check_in <= day && r.check_out > day)
    ).length
    const occupancyRate = Math.round((bookedDays / 30) * 100)

    return { totalRevenue, bookingCount, occupancyRate }
  }, [reservations])

  const upcoming = useMemo(
    () =>
      reservations
        .filter((r) => r.status === 'confirmed' && r.check_in >= new Date().toISOString().split('T')[0])
        .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
        .slice(0, 6),
    [reservations],
  )

  const recentBookings = useMemo(
    () =>
      [...reservations]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10),
    [reservations],
  )

  const monthlyRevenue = useMemo(() => {
    const now = new Date()
    const months: { label: string; year: number; month: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ label: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth() })
    }
    const paid = reservations.filter((r) => r.status === 'confirmed' || r.status === 'completed')
    return months.map((m) => ({
      month: m.label,
      revenue: paid
        .filter((r) => {
          const d = new Date(r.check_in + 'T12:00:00')
          return d.getFullYear() === m.year && d.getMonth() === m.month
        })
        .reduce((sum, r) => sum + r.total_price, 0),
    }))
  }, [reservations])

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-4 bg-tertiary rounded w-32" />
        <div className="rounded-xl bg-tertiary h-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-tertiary" />
              <div className="h-6 bg-tertiary rounded w-16" />
              <div className="h-3 bg-tertiary rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="space-y-5">
        <Link
          href="/dashboard/imoveis"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para Imóveis
        </Link>
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Erro ao carregar</h3>
          <p className="text-xs text-text-secondary mb-4 text-center max-w-xs">{error}</p>
        </div>
      </div>
    )
  }

  const location = [property.city, property.state, property.country].filter(Boolean).join(', ')
  const totalRevenueFmt = stats.totalRevenue.toLocaleString('pt-BR')

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/imoveis"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para Imóveis
      </Link>

      {/* Header */}
      <div className="rounded-xl overflow-hidden bg-card border border-border">
        {property.cover_image?.image_url ? (
          <div className="relative h-48 sm:h-64">
            <img
              src={property.cover_image.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{property.title}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'active'
                      ? 'bg-success/15 text-white'
                      : 'bg-black/30 text-white'
                  }`}
                >
                  {property.status_label}
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
                <MapPin size={14} />
                {location} · {property.property_type_label}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-primary-light text-primary-dark p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold">{property.title}</h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      property.status === 'active'
                        ? 'bg-success/15 text-success'
                        : 'bg-black/10 text-text-secondary'
                    }`}
                  >
                    {property.status_label}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm opacity-80">
                  <MapPin size={14} />
                  {location} · {property.property_type_label}
                </p>
                {property.description && (
                  <p className="mt-3 text-sm opacity-75 max-w-2xl leading-relaxed">
                    {property.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => openLightbox(i)}
              className={`relative group overflow-hidden bg-surface rounded-lg ${
                i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'
              }`}
            >
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
              />
              {i === 4 && allImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <span className="text-white text-lg font-bold">+{allImages.length - 5}</span>
                </div>
              )}
              {img.is_cover && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Capa
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <img
            src={allImages[lightboxIndex].image_url}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-success bg-success/10">
            <DollarSign size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">R$ {totalRevenueFmt}</p>
          <p className="text-xs text-text-secondary mt-0.5">Receita Total</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-primary-light">
            <CalendarCheck size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">{stats.bookingCount}</p>
          <p className="text-xs text-text-secondary mt-0.5">Reservas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600 bg-amber-100">
            <TrendingUp size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">{stats.occupancyRate}%</p>
          <p className="text-xs text-text-secondary mt-0.5">Ocupação (30 dias)</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600 bg-amber-100">
            <Star size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">—</p>
          <p className="text-xs text-text-secondary mt-0.5">Avaliações</p>
        </div>
      </div>

      {/* Details + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Detalhes</h2>
          <div className="space-y-3.5">
            {[
              { icon: Bed, label: 'Quartos', value: `${property.bedrooms} quartos` },
              { icon: Bath, label: 'Banheiros', value: `${property.bathrooms} banheiros` },
              { icon: Users, label: 'Capacidade', value: `Até ${property.max_guests} hóspedes` },
              { icon: DollarSign, label: 'Diária', value: `R$ ${property.price_per_night.toLocaleString('pt-BR')}` },
              { icon: MapPin, label: 'Localização', value: location },
              { icon: CalendarCheck, label: 'Tipo', value: property.property_type_label },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{item.label}</p>
                    <p className="text-sm font-medium text-text-primary">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Próximos Eventos</h2>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarCheck size={32} className="text-text-secondary/40 mb-3" />
              <p className="text-sm font-medium text-text-primary">Nenhum evento nos próximos dias</p>
              <p className="text-xs text-text-secondary mt-1">As reservas aparecerão aqui automaticamente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.flatMap((r) => {
                const events: { id: string; guest: string; property: string; date: string; type: 'checkin' | 'checkout' }[] = []
                if (r.check_in) events.push({ id: `in-${r.id}`, guest: r.guest?.name ?? 'Convidado', property: r.property?.title ?? '', date: r.check_in, type: 'checkin' })
                if (r.check_out) events.push({ id: `out-${r.id}`, guest: r.guest?.name ?? 'Convidado', property: r.property?.title ?? '', date: r.check_out, type: 'checkout' })
                return events
              }).map((ev) => {
                const isCheckin = ev.type === 'checkin'
                const date = new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                return (
                  <div key={ev.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCheckin ? 'bg-success/10 text-success' : 'bg-primary-light text-primary'}`}>
                      {isCheckin ? <LogIn size={16} /> : <LogOut size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{ev.guest}</p>
                      <p className="text-xs text-text-secondary truncate">{ev.property}</p>
                    </div>
                    <span className="text-xs font-medium text-text-secondary whitespace-nowrap">{date}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Receita Mensal</h2>
            <p className="text-xs text-text-secondary mt-0.5">Últimos 6 meses</p>
          </div>
        </div>
        {stats.bookingCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <TrendingUp size={32} className="text-text-secondary/40 mb-3" />
            <p className="text-sm font-medium text-text-primary">Nenhuma reserva ainda</p>
            <p className="text-xs text-text-secondary mt-1">O gráfico será exibido quando houver reservas</p>
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2">
            {monthlyRevenue.map((m) => {
              const maxRev = Math.max(...monthlyRevenue.map((x) => x.revenue), 1)
              const height = (m.revenue / maxRev) * 100
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t-md" style={{ height: `${Math.max(height, 4)}%` }}>
                    <div
                      className="w-full bg-primary rounded-t-md transition-all duration-300"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-[10px] text-text-secondary">{m.month}</span>
                  <span className="text-[10px] font-medium text-text-primary">
                    R$ {(m.revenue / 1000).toFixed(1)}k
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bookings list */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Reservas deste Imóvel</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarCheck size={32} className="text-text-secondary/40 mb-3" />
            <p className="text-sm font-medium text-text-primary">Nenhuma reserva ainda</p>
            <p className="text-xs text-text-secondary mt-1">Quando houver reservas, elas aparecerão aqui</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspede</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-in</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-out</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">
                          {r.guest ? getInitials(r.guest.name) : '--'}
                        </div>
                        <span className="font-medium text-text-primary">{r.guest?.name ?? 'Convidado'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-text-secondary">{formatDate(r.check_in)}</td>
                    <td className="py-3 px-2 text-text-secondary">{formatDate(r.check_out)}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status] ?? ''}`}>
                        {r.status_label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-text-primary">
                      R$ {r.total_price.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Availability */}
      <AvailabilityManager propertyId={id} />

      {/* Danger zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Zona de perigo</h3>
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Excluir imóvel</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Esta ação é irreversível. Todas as informações deste imóvel serão removidas permanentemente.
              </p>
            </div>
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors"
            >
              <Trash2 size={16} />
              Excluir imóvel
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-error">Tem certeza? Esta ação não pode ser desfeita.</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-lg border border-border bg-card text-text-secondary text-sm font-medium hover:bg-surface transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors disabled:opacity-40"
                >
                  {deleteLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {deleteLoading ? 'Excluindo...' : 'Sim, excluir permanentemente'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
