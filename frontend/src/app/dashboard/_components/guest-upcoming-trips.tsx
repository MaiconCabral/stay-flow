'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Luggage } from 'lucide-react'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'
import { useAuth } from '@/contexts/AuthContext'

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function GuestUpcomingTrips() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<ReservationResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const now = new Date().toISOString().split('T')[0]
        const res = await fetchReservations({
          date_to: now,
          status: 'confirmed',
          per_page: 10,
        })
        setTrips(res.data)
      } catch {
        setTrips([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Próximas Viagens</h2>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 h-[88px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Próximas Viagens</h2>
        <Link
          href="/dashboard/reservas"
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Ver todas
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary mx-auto mb-4">
            <Luggage size={28} />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhuma viagem agendada</h3>
          <p className="text-xs text-text-secondary mb-4">
            Explore imóveis e planeje sua próxima estadia
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar imóveis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/imoveis/${trip.property_id}`}
              className="block bg-card rounded-xl border border-border p-4 hover:shadow-sm hover:border-primary/20 transition-all duration-150"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {trip.property?.title ? getInitials(trip.property.title) : '--'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {trip.property?.title ?? 'Imóvel'}
                  </p>
                  {trip.property?.city && (
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                      <MapPin size={12} />
                      {trip.property.city}, {trip.property.state}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(trip.check_in)}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(trip.check_out)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-text-primary">
                    R$ {Number(trip.total_price).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
