'use client'

import { useEffect, useCallback } from 'react'
import { X, Home, Calendar, Moon, DollarSign, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import { type Booking, statusStyles, parseCheckIn, parseCheckOut } from '@/lib/dashboard-data'

function calcNights(checkIn: string, checkOut: string): number {
  const [d1, m1] = checkIn.split('/').map(Number)
  const [d2, m2] = checkOut.split('/').map(Number)
  const start = new Date(2026, m1 - 1, d1)
  const end = new Date(2026, m2 - 1, d2)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendente',
  cancelled: 'Cancelada',
  completed: 'Concluída',
}

export default function BookingModal({
  booking,
  onClose,
}: {
  booking: Booking
  onClose: () => void
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  const nights = calcNights(booking.checkIn, booking.checkOut)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div
        className="relative bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes da reserva"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold">
              {booking.avatar}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{booking.guest}</h2>
              <p className="text-xs text-text-secondary">{booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
            <Home size={18} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-text-primary">{booking.property}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border">
              <Calendar size={16} className="text-text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-text-secondary">Check-in</p>
                <p className="text-sm font-medium text-text-primary">{booking.checkIn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border">
              <Calendar size={16} className="text-text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-text-secondary">Check-out</p>
                <p className="text-sm font-medium text-text-primary">{booking.checkOut}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-text-secondary flex-shrink-0" />
              <span className="text-sm text-text-secondary">Total de noites</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">{nights} noites</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2.5">
              <DollarSign size={16} className="text-success flex-shrink-0" />
              <span className="text-sm text-text-secondary">Valor total</span>
            </div>
            <span className="text-base font-bold text-text-primary">
              R$ {booking.amount.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <span className="text-sm text-text-secondary">Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
              {statusLabel[booking.status]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 p-5 pt-0">
          <Link
            href={`/dashboard/imoveis/${booking.propertyId}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
          >
            <Eye size={16} />
            Ver Imóvel
          </Link>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium border border-border text-text-secondary hover:bg-surface hover:text-text-primary transition-colors">
            <Pencil size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
