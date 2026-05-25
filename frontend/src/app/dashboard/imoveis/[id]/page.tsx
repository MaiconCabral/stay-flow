'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, MapPin, Users, Bed, Bath, DollarSign, CalendarCheck,
  TrendingUp, Star, AlertCircle, Trash2, Loader2, AlertTriangle,
} from 'lucide-react'
import { fetchProperty, deleteProperty, type PropertyResource } from '@/lib/property'
import type { AxiosError } from 'axios'

export default function ImovelPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [property, setProperty] = useState<PropertyResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (isNaN(id)) {
      setError('ID inválido')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProperty(id)
      .then((data) => {
        if (!cancelled) setProperty(data)
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
      <div className="rounded-xl overflow-hidden bg-primary-light text-primary-dark">
        <div className="p-6 sm:p-8">
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
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-success bg-success/10">
            <DollarSign size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">R$ 0</p>
          <p className="text-xs text-text-secondary mt-0.5">Receita Total</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-primary-light">
            <CalendarCheck size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">0</p>
          <p className="text-xs text-text-secondary mt-0.5">Reservas</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600 bg-amber-100">
            <TrendingUp size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">0%</p>
          <p className="text-xs text-text-secondary mt-0.5">Ocupação</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-600 bg-amber-100">
            <Star size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">—</p>
          <p className="text-xs text-text-secondary mt-0.5">Avaliações</p>
        </div>
      </div>

      {/* Details */}
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
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarCheck size={32} className="text-text-secondary/40 mb-3" />
            <p className="text-sm font-medium text-text-primary">Nenhum evento nos próximos dias</p>
            <p className="text-xs text-text-secondary mt-1">As reservas aparecerão aqui automaticamente</p>
          </div>
        </div>
      </div>

      {/* Revenue chart placeholder */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Receita Mensal</h2>
            <p className="text-xs text-text-secondary mt-0.5">Últimos 6 meses</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <TrendingUp size={32} className="text-text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-text-primary">Conecte-se ao Stripe</p>
          <p className="text-xs text-text-secondary mt-1">Configure sua integração para ver relatórios de receita</p>
        </div>
      </div>

      {/* Bookings placeholder */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Reservas deste Imóvel</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CalendarCheck size={32} className="text-text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-text-primary">Nenhuma reserva ainda</p>
          <p className="text-xs text-text-secondary mt-1">Quando houver reservas, elas aparecerão aqui</p>
        </div>
      </div>

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
