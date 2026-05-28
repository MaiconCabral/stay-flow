'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, Star, Luggage, Heart } from 'lucide-react'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'
import { useAuth } from '@/contexts/AuthContext'

interface GuestStats {
  upcoming_trips: number
  active_reservations: number
  past_trips: number
  pending_reviews: number
  wishlist_count: number
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | number
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </div>
  )
}

export default function GuestOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<GuestStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchReservations({ per_page: 200 })
        const reservations = res.data
        const now = new Date()
        const nowStr = now.toISOString().split('T')[0]

        const upcomingTrips = reservations.filter(
          (r: ReservationResource) => r.status === 'confirmed' && r.check_in >= nowStr
        ).length

        const active = reservations.filter(
          (r: ReservationResource) => r.status === 'confirmed' && r.check_out >= nowStr
        ).length

        const pastTrips = reservations.filter(
          (r: ReservationResource) => r.status === 'completed' || r.status === 'cancelled'
        ).length

        const pendingReviews = reservations.filter(
          (r: ReservationResource) => r.status === 'completed'
        ).length

        setStats({
          upcoming_trips: upcomingTrips,
          active_reservations: active,
          past_trips: pastTrips,
          pending_reviews: pendingReviews,
          wishlist_count: 0,
        })
      } catch {
        setStats({
          upcoming_trips: 0,
          active_reservations: 0,
          past_trips: 0,
          pending_reviews: 0,
          wishlist_count: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 h-[88px]" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-4">Minhas Estatísticas</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Luggage} label="Próximas Viagens" value={stats?.upcoming_trips ?? 0} />
        <StatCard icon={CalendarCheck} label="Reservas Ativas" value={stats?.active_reservations ?? 0} />
        <StatCard icon={Heart} label="Favoritos" value={stats?.wishlist_count ?? 0} />
        <StatCard icon={Star} label="Avaliações Pendentes" value={stats?.pending_reviews ?? 0} />
      </div>
    </div>
  )
}
