'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import { Search, SlidersHorizontal, CalendarDays, List, CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import BookingModal from '../_components/booking-modal'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'

const tabs = [
  { key: 'all', label: 'Todas' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'cancelled', label: 'Canceladas' },
  { key: 'completed', label: 'Concluídas' },
]

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendente',
  cancelled: 'Cancelada',
  completed: 'Concluída',
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-error/10 text-error',
  completed: 'bg-primary-light text-primary-dark',
}

const eventColors: Record<string, { bg: string; border: string }> = {
  confirmed: { bg: '#10B981', border: '#059669' },
  pending: { bg: '#F59E0B', border: '#D97706' },
  cancelled: { bg: '#EF4444', border: '#DC2626' },
  completed: { bg: '#94A3B8', border: '#64748B' },
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ReservasPage() {
  const [reservations, setReservations] = useState<ReservationResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedReservation, setSelectedReservation] = useState<ReservationResource | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchReservations({ per_page: 100 })
      .then((res) => {
        if (!cancelled) setReservations(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Erro ao carregar reservas')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let list = reservations
    if (activeTab !== 'all') {
      list = list.filter((r) => r.status === activeTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.guest?.name?.toLowerCase().includes(q) ||
          r.property?.title?.toLowerCase().includes(q) ||
          String(r.id).includes(q)
      )
    }
    return list.sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime())
  }, [reservations, activeTab, search])

  const counts = useMemo(() => {
    const all = reservations.length
    const confirmed = reservations.filter((r) => r.status === 'confirmed').length
    const pending = reservations.filter((r) => r.status === 'pending').length
    const cancelled = reservations.filter((r) => r.status === 'cancelled').length
    const completed = reservations.filter((r) => r.status === 'completed').length
    return { all, confirmed, pending, cancelled, completed }
  }, [reservations])

  const calendarEvents = useMemo(
    () =>
      filtered.map((r) => ({
        id: String(r.id),
        title: r.guest?.name ?? 'Hóspede',
        start: r.check_in,
        end: r.check_out,
        backgroundColor: eventColors[r.status]?.bg ?? '#94A3B8',
        borderColor: eventColors[r.status]?.border ?? '#64748B',
        textColor: '#fff',
        extendedProps: { reservation: r },
      })),
    [filtered]
  )

  const handleEventClick = useCallback((info: EventClickArg) => {
    setSelectedReservation(info.event.extendedProps.reservation as ReservationResource)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-tertiary rounded w-32" />
        <div className="h-10 bg-tertiary rounded w-full" />
        <div className="h-[500px] bg-tertiary rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold text-text-primary">Reservas</h1>
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border">
          <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
            <CalendarCheck size={28} />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Erro ao carregar</h3>
          <p className="text-xs text-text-secondary mb-4 text-center max-w-xs">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Reservas</h1>
          <p className="text-sm text-text-secondary">{reservations.length} no total</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-text-secondary text-sm flex-1 sm:flex-initial">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar hóspede ou imóvel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-28 sm:w-44 text-text-primary placeholder:text-text-secondary"
            />
          </div>
          <button
            className="p-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-150"
            aria-label="Filtrar"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Tabs + View Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-card text-text-secondary border border-border hover:bg-surface hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-surface text-text-secondary'
                }`}
              >
                {counts[tab.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex bg-card border border-border rounded-lg overflow-hidden flex-shrink-0">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              viewMode === 'calendar'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">Calendário</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={16} />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-card rounded-xl border border-border p-3 sm:p-5">
          {calendarEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CalendarCheck size={32} className="text-text-secondary mb-3" />
              <p className="text-sm text-text-secondary">Nenhuma reserva para exibir no calendário</p>
              {(search || activeTab !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setActiveTab('all') }}
                  className="mt-2 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="fc-custom">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="pt-br"
                firstDay={0}
                height="auto"
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: '',
                }}
                buttonText={{
                  today: 'Hoje',
                }}
                noEventsText="Nenhuma reserva neste período"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                <CalendarCheck size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Nenhuma reserva encontrada</h3>
              <p className="text-xs text-text-secondary mb-4">
                {search ? 'Tente alterar o termo da busca' : 'Nenhuma reserva com este status'}
              </p>
              {(search || activeTab !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setActiveTab('all') }}
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspede</th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Imóvel</th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-in</th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Check-out</th>
                      <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="text-right py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedReservation(r)}
                      >
                        <td className="py-3.5 px-4">
                          <Link href={`/dashboard/imoveis/${r.property_id}`} className="flex items-center gap-2.5 hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold">
                              {getInitials(r.guest?.name ?? '??')}
                            </div>
                            <div>
                              <span className="font-medium text-text-primary">{r.guest?.name ?? 'Hóspede'}</span>
                              <span className="block text-[11px] text-text-secondary">#{r.id}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-text-secondary">{r.property?.title ?? '—'}</td>
                        <td className="py-3.5 px-4 text-text-secondary">{formatDate(r.check_in)}</td>
                        <td className="py-3.5 px-4 text-text-secondary">{formatDate(r.check_out)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status] ?? ''}`}>
                            {statusLabel[r.status] ?? r.status_label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-text-primary">
                          R$ {Number(r.total_price).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-border">
                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 cursor-pointer hover:bg-surface/30 transition-colors"
                    onClick={() => setSelectedReservation(r)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={`/dashboard/imoveis/${r.property_id}`} className="flex items-center gap-2.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {getInitials(r.guest?.name ?? '??')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{r.guest?.name ?? 'Hóspede'}</p>
                          <p className="text-xs text-text-secondary truncate">#{r.id}</p>
                        </div>
                      </Link>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${statusStyles[r.status] ?? ''}`}>
                        {statusLabel[r.status] ?? r.status_label}
                      </span>
                    </div>
                    <div className="ml-11 space-y-1 text-xs text-text-secondary">
                      <p>{r.property?.title ?? '—'}</p>
                      <p>{formatDate(r.check_in)} → {formatDate(r.check_out)}</p>
                      <p className="font-semibold text-text-primary">R$ {Number(r.total_price).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-xs text-text-secondary text-center">
              Exibindo {filtered.length} de {reservations.length} reservas
            </p>
          )}
        </>
      )}

      {/* Modal */}
      {selectedReservation && (
        <BookingModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
      )}
    </div>
  )
}
