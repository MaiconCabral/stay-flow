'use client'

import { useEffect, useState } from 'react'
import StatsCards from './_components/stats-cards'
import type { StatCardData } from './_components/stats-cards'
import RevenueChart from './_components/revenue-chart'
import type { MonthlyRevenueData } from './_components/revenue-chart'
import RecentBookings from './_components/recent-bookings'
import UpcomingEvents from './_components/upcoming-events'
import type { EventData } from './_components/upcoming-events'
import PropertyOverview from './_components/property-overview'
import type { PropertySummary } from './_components/property-overview'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'
import { fetchProperties, type PropertyResource } from '@/lib/property'

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getLast6Months(): { label: string; year: number; month: number }[] {
  const now = new Date()
  const result: { label: string; year: number; month: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ label: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth() })
  }
  return result
}

function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr + 'T12:00:00')
  return d.getFullYear() === year && d.getMonth() === month
}

function isActiveReservation(r: ReservationResource): boolean {
  return r.status === 'confirmed' || r.status === 'pending'
}

function computeDashboardData(reservations: ReservationResource[], properties: PropertyResource[]) {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const paidReservations = reservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'completed'
  )

  // Current month revenue
  const currentRevenue = paidReservations
    .filter((r) => isSameMonth(r.check_in, currentYear, currentMonth))
    .reduce((sum, r) => sum + r.total_price, 0)

  // Previous month revenue
  const prevRevenue = paidReservations
    .filter((r) => isSameMonth(r.check_in, prevYear, prevMonth))
    .reduce((sum, r) => sum + r.total_price, 0)

  const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0

  // Active reservations (confirmed or pending with future/current check-in)
  const activeReservations = reservations.filter(
    (r) => isActiveReservation(r) && r.check_in >= today
  ).length

  const prevActiveCount = reservations.filter(
    (r) =>
      isActiveReservation(r) &&
      r.check_in >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] &&
      r.check_in < today
  ).length

  const activeChange = prevActiveCount > 0
    ? ((activeReservations - prevActiveCount) / prevActiveCount) * 100
    : 0

  // Occupancy rate for next 30 days
  const activeProps = properties.filter((p) => p.status === 'active')
  const totalSlots = activeProps.length * 30
  let bookedSlots = 0
  for (let i = 0; i < 30; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const dayStr = day.toISOString().split('T')[0]
    const bookedIds = new Set(
      paidReservations
        .filter((r) => r.check_in <= dayStr && r.check_out > dayStr)
        .map((r) => r.property_id)
    )
    bookedSlots += bookedIds.size
  }
  const occupancyRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0

  // Revenue trend for occupancy (compare next-30-days occupancy with last-30-days)
  let prevBookedSlots = 0
  for (let i = 30; i < 60; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const dayStr = day.toISOString().split('T')[0]
    const bookedIds = new Set(
      paidReservations
        .filter((r) => r.check_in <= dayStr && r.check_out > dayStr)
        .map((r) => r.property_id)
    )
    prevBookedSlots += bookedIds.size
  }
  const prevOccupancyRate = totalSlots > 0
    ? Math.round((prevBookedSlots / totalSlots) * 100)
    : 0
  const occupancyChange = prevOccupancyRate > 0
    ? ((occupancyRate - prevOccupancyRate) / prevOccupancyRate) * 100
    : 0

  const statsCards: StatCardData[] = [
    {
      label: 'Receita Total',
      value: `R$ ${(currentRevenue / 1000).toFixed(1)}k`,
      change: Math.round(revenueChange * 10) / 10,
      icon: 'trending-up',
      trend: revenueChange >= 0 ? 'up' : 'down',
    },
    {
      label: 'Reservas Ativas',
      value: String(activeReservations),
      change: Math.round(activeChange * 10) / 10,
      icon: 'calendar-check',
      trend: activeChange >= 0 ? 'up' : 'down',
    },
    {
      label: 'Taxa de Ocupação',
      value: `${occupancyRate}%`,
      change: Math.round(occupancyChange * 10) / 10,
      icon: 'home',
      trend: occupancyChange >= 0 ? 'up' : 'down',
    },
    {
      label: 'Imóveis Ativos',
      value: String(activeProps.length),
      change: 0,
      icon: 'building2',
      trend: 'up',
    },
  ]

  const months = getLast6Months()
  const monthlyRevenue: MonthlyRevenueData[] = months.map((m) => ({
    month: m.label,
    revenue: paidReservations
      .filter((r) => isSameMonth(r.check_in, m.year, m.month))
      .reduce((sum, r) => sum + r.total_price, 0),
  }))

  const chartChangePercent =
    monthlyRevenue.length >= 2 && monthlyRevenue[monthlyRevenue.length - 2].revenue > 0
      ? ((monthlyRevenue[monthlyRevenue.length - 1].revenue -
          monthlyRevenue[monthlyRevenue.length - 2].revenue) /
          monthlyRevenue[monthlyRevenue.length - 2].revenue) *
        100
      : 0

  const recentBookings = [...reservations]
    .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime())
    .slice(0, 10)

  const futureReservations = reservations.filter(
    (r) => r.status === 'confirmed' && r.check_in >= today
  )
  const upcomingEvents: EventData[] = futureReservations.flatMap((r) => {
    const events: EventData[] = []
    if (r.check_in) {
      events.push({
        id: `checkin-${r.id}`,
        guest: r.guest?.name ?? 'Convidado',
        property: r.property?.title ?? 'Imóvel',
        date: r.check_in,
        type: 'checkin',
      })
    }
    if (r.check_out) {
      events.push({
        id: `checkout-${r.id}`,
        guest: r.guest?.name ?? 'Convidado',
        property: r.property?.title ?? 'Imóvel',
        date: r.check_out,
        type: 'checkout',
      })
    }
    return events
  })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8)

  const propertyRevenueMap: Record<number, { revenue: number; bookings: number }> = {}
  for (const r of paidReservations) {
    if (!propertyRevenueMap[r.property_id]) {
      propertyRevenueMap[r.property_id] = { revenue: 0, bookings: 0 }
    }
    propertyRevenueMap[r.property_id].revenue += r.total_price
    propertyRevenueMap[r.property_id].bookings += 1
  }

  const propertySummaries: PropertySummary[] = properties
    .filter((p) => p.status === 'active')
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.title,
      location: `${p.city}, ${p.state}`,
      coverImage: p.cover_image?.image_url ?? null,
      rating: 0, // would need reviews endpoint
      revenue: propertyRevenueMap[p.id]?.revenue ?? 0,
      bookings: propertyRevenueMap[p.id]?.bookings ?? 0,
    }))

  return {
    statsCards,
    monthlyRevenue,
    chartChangePercent,
    recentBookings,
    upcomingEvents,
    propertySummaries,
  }
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<ReservationResource[]>([])
  const [properties, setProperties] = useState<PropertyResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const oneMonthLater = new Date()
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

        const [reservationsRes, propertiesRes] = await Promise.all([
          fetchReservations({
            date_from: sixMonthsAgo.toISOString().split('T')[0],
            date_to: oneMonthLater.toISOString().split('T')[0],
            per_page: 200,
          }),
          fetchProperties({ per_page: 100 }),
        ])
        setReservations(reservationsRes.data)
        setProperties(propertiesRes.data)
      } catch {
        setError('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 bg-card rounded-xl border border-border p-5 h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border h-[260px]" />
          <div className="bg-card rounded-xl border border-border h-[260px]" />
        </div>
        <div className="bg-card rounded-xl border border-border h-[300px]" />
        <div className="bg-card rounded-xl border border-border h-[200px]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error/5 border border-error/20 rounded-xl p-8 text-center">
        <p className="text-error font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const data = computeDashboardData(reservations, properties)

  return (
    <div className="space-y-5">
      <StatsCards cards={data.statsCards} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart data={data.monthlyRevenue} changePercent={data.chartChangePercent} />
        </div>
        <div>
          <UpcomingEvents events={data.upcomingEvents} />
        </div>
      </div>
      <RecentBookings reservations={data.recentBookings} />
      <PropertyOverview properties={data.propertySummaries} />
    </div>
  )
}
