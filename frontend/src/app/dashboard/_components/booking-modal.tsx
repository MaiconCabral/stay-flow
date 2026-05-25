'use client'

import { useEffect, useCallback, useState } from 'react'
import { X, Home, Calendar, Moon, DollarSign, Eye, Pencil, AlertTriangle, Loader2, Ban, Star } from 'lucide-react'
import Link from 'next/link'
import { cancelReservation, type ReservationResource } from '@/lib/reservation'
import { createReview } from '@/lib/review'
import { useAuth } from '@/contexts/AuthContext'
import type { AxiosError } from 'axios'

const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-error/10 text-error',
  completed: 'bg-primary-light text-primary-dark',
}

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendente',
  cancelled: 'Cancelada',
  completed: 'Concluída',
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function BookingModal({
  reservation,
  onClose,
}: {
  reservation: ReservationResource
  onClose: () => void
}) {
  const { user } = useAuth()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

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

  const nights = calcNights(reservation.check_in, reservation.check_out)

  const handleCancel = useCallback(async () => {
    if (!cancelReason.trim()) return
    setCancelling(true)
    setCancelError('')
    try {
      await cancelReservation(reservation.id, cancelReason.trim())
      setCancelled(true)
      setConfirmCancel(false)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>
      setCancelError(axiosErr.response?.data?.message ?? 'Erro ao cancelar reserva')
    } finally {
      setCancelling(false)
    }
  }, [reservation.id, cancelReason])

  const isCancelable = reservation.status === 'pending' || reservation.status === 'confirmed'
  const initials = reservation.guest?.name
    ? reservation.guest.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

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
              {initials}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{reservation.guest?.name ?? 'Hóspede'}</h2>
              <p className="text-xs text-text-secondary">#{reservation.id}</p>
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
        {cancelled ? (
          <div className="p-5 space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-3">
                <Ban size={28} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Reserva cancelada</h3>
              <p className="text-xs text-text-secondary">A reserva foi cancelada com sucesso.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <Home size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-text-primary">{reservation.property?.title ?? 'Imóvel'}</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border">
                <Calendar size={16} className="text-text-secondary flex-shrink-0" />
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="text-xs text-text-secondary">Check-in</p>
                    <p className="text-sm font-medium text-text-primary">{formatDate(reservation.check_in)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Check-out</p>
                    <p className="text-sm font-medium text-text-primary">{formatDate(reservation.check_out)}</p>
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

              <div className="space-y-2 p-3 rounded-lg border border-border">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span>R$ {Number(reservation.subtotal).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Taxa de limpeza</span>
                  <span>R$ {Number(reservation.cleaning_fee).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Taxa de serviço</span>
                  <span>R$ {Number(reservation.service_fee).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-border">
                  <span>Total</span>
                  <span>R$ {Number(reservation.total_price).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-text-secondary">Status</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[reservation.status] ?? ''}`}>
                  {statusLabel[reservation.status] ?? reservation.status_label}
                </span>
              </div>

              {/* Review section */}
              {reservation.status === 'completed' && user?.id === reservation.guest_id && !reviewSuccess && (
                <div className="space-y-3">
                  {!showReview ? (
                    <button
                      onClick={() => setShowReview(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/50 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                    >
                      <Star size={16} />
                      Avaliar estadia
                    </button>
                  ) : (
                    <div className="space-y-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <p className="text-xs font-semibold text-text-primary">Avalie sua estadia</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`p-0.5 transition-colors ${
                              star <= reviewRating ? 'text-amber-400' : 'text-text-secondary/30'
                            }`}
                          >
                            <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Compartilhe sua experiência..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      />
                      {reviewError && <p className="text-xs text-error">{reviewError}</p>}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            if (reviewRating === 0 || !reviewComment.trim()) {
                              setReviewError('Selecione uma nota e escreva um comentário.')
                              return
                            }
                            setReviewSubmitting(true)
                            setReviewError('')
                            try {
                              await createReview(reservation.property_id, {
                                reservation_id: reservation.id,
                                rating: reviewRating,
                                comment: reviewComment.trim(),
                              })
                              setReviewSuccess(true)
                              setShowReview(false)
                            } catch (err: unknown) {
                              const axiosErr = err as { response?: { data?: { message?: string } } }
                              setReviewError(axiosErr.response?.data?.message ?? 'Erro ao enviar avaliação.')
                            } finally {
                              setReviewSubmitting(false)
                            }
                          }}
                          disabled={reviewSubmitting || reviewRating === 0 || !reviewComment.trim()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                          {reviewSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                          {reviewSubmitting ? 'Enviando...' : 'Enviar avaliação'}
                        </button>
                        <button
                          onClick={() => { setShowReview(false); setReviewError(''); setReviewRating(0); setReviewComment('') }}
                          disabled={reviewSubmitting}
                          className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface transition-colors disabled:opacity-40"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {reviewSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                  <Star size={16} className="text-success flex-shrink-0" />
                  <p className="text-xs text-success font-medium">Avaliação enviada com sucesso!</p>
                </div>
              )}

              {reservation.notes && (
                <div className="p-3 rounded-lg border border-border">
                  <p className="text-xs text-text-secondary mb-1">Observações</p>
                  <p className="text-sm text-text-primary">{reservation.notes}</p>
                </div>
              )}

              {/* Cancel section */}
              {isCancelable && (
                <div className="space-y-3">
                  {!confirmCancel ? (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-error/50 text-error text-sm font-medium hover:bg-error/5 transition-colors"
                    >
                      <Ban size={16} />
                      Cancelar reserva
                    </button>
                  ) : (
                    <div className="space-y-3 p-3 rounded-lg border border-error/30 bg-error/5">
                      <p className="text-xs font-medium text-error">Tem certeza? Informe o motivo do cancelamento:</p>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Descreva o motivo..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      />
                      {cancelError && <p className="text-xs text-error">{cancelError}</p>}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setConfirmCancel(false); setCancelReason(''); setCancelError('') }}
                          disabled={cancelling}
                          className="flex-1 py-2 rounded-lg border border-border bg-card text-text-secondary text-sm font-medium hover:bg-surface transition-colors disabled:opacity-40"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={cancelling || !cancelReason.trim()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors disabled:opacity-40"
                        >
                          {cancelling ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                          {cancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 p-5 pt-0">
              <Link
                href={`/dashboard/imoveis/${reservation.property_id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
              >
                <Eye size={16} />
                Ver Imóvel
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
