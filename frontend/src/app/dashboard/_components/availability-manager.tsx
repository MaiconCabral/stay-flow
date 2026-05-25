'use client'

import { useEffect, useState, useMemo } from 'react'
import { CalendarX, Plus, Trash2, Loader2, AlertCircle, X } from 'lucide-react'
import { fetchAvailabilities, createAvailability, deleteAvailability, type AvailabilityResource } from '@/lib/availability'
import { fetchReservations, type ReservationResource } from '@/lib/reservation'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR')
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

interface BlockForm {
  startDate: string
  endDate: string
  reason: string
}

export default function AvailabilityManager({ propertyId }: { propertyId: number }) {
  const [availabilities, setAvailabilities] = useState<AvailabilityResource[]>([])
  const [reservations, setReservations] = useState<ReservationResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [form, setForm] = useState<BlockForm>({ startDate: '', endDate: '', reason: '' })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchAvailabilities({ property_id: propertyId, per_page: 100 }),
      fetchReservations({ property_id: propertyId, per_page: 100 }),
    ])
      .then(([availRes, reservRes]) => {
        if (!cancelled) {
          setAvailabilities(availRes.data)
          setReservations(reservRes.data)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar disponibilidade')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [propertyId])

  const blockedDates = useMemo(
    () => availabilities.filter((a) => !a.is_available),
    [availabilities],
  )

  const confirmedReservations = useMemo(
    () => reservations.filter((r) => r.status === 'confirmed' || r.status === 'pending'),
    [reservations],
  )

  const handleBlock = async () => {
    setFormError(null)
    if (!form.startDate || !form.endDate) {
      setFormError('Selecione a data de início e fim.')
      return
    }
    if (form.startDate < todayStr()) {
      setFormError('A data de início não pode ser no passado.')
      return
    }
    if (form.endDate < form.startDate) {
      setFormError('A data de fim deve ser após a data de início.')
      return
    }

    const hasOverlap = confirmedReservations.some(
      (r) => r.check_in < form.endDate && r.check_out > form.startDate,
    )
    if (hasOverlap) {
      setFormError('Este período conflita com uma reserva existente.')
      return
    }

    setSaving(true)
    try {
      const created = await createAvailability({
        property_id: propertyId,
        start_date: form.startDate,
        end_date: form.endDate,
        is_available: false,
        reason: form.reason || undefined,
      })
      setAvailabilities((prev) => [...prev, created])
      setShowForm(false)
      setForm({ startDate: '', endDate: '', reason: '' })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setFormError(axiosErr.response?.data?.message ?? 'Erro ao bloquear datas.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteAvailability(id)
      setAvailabilities((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError('Erro ao remover bloqueio.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-text-secondary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Disponibilidade</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {blockedDates.length > 0
              ? `${blockedDates.length} ${blockedDates.length === 1 ? 'período bloqueado' : 'períodos bloqueados'}`
              : 'Nenhum período bloqueado'}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            Bloquear datas
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-error/5 border border-error/20 mb-4">
          <AlertCircle size={14} className="text-error flex-shrink-0" />
          <p className="text-xs text-error">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={14} className="text-error" />
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-4 p-4 rounded-lg border border-border bg-surface space-y-3">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Bloquear Período</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Data início</label>
              <input
                type="date"
                value={form.startDate}
                min={todayStr()}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Data fim</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || todayStr()}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Motivo (opcional)</label>
            <input
              type="text"
              value={form.reason}
              placeholder="Ex: Manutenção, uso pessoal..."
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          {formError && (
            <div className="flex items-center gap-2 p-2 rounded bg-error/5 border border-error/20">
              <AlertCircle size={12} className="text-error flex-shrink-0" />
              <p className="text-xs text-error">{formError}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBlock}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CalendarX size={14} />}
              {saving ? 'Bloqueando...' : 'Bloquear'}
            </button>
            <button
              onClick={() => { setShowForm(false); setFormError(null); setForm({ startDate: '', endDate: '', reason: '' }) }}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-border text-text-secondary text-xs font-medium hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {blockedDates.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarX size={28} className="text-text-secondary/40 mb-2" />
          <p className="text-sm font-medium text-text-primary">Nenhum bloqueio</p>
          <p className="text-xs text-text-secondary mt-1">Bloqueie datas para manutenção ou uso pessoal</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blockedDates.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg border border-border hover:bg-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(block.start_date)} → {formatDate(block.end_date)}
                </p>
                {block.reason && (
                  <p className="text-xs text-text-secondary mt-0.5 truncate">{block.reason}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(block.id)}
                disabled={deletingId === block.id}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-error hover:bg-error/5 transition-colors disabled:opacity-40 flex-shrink-0"
              >
                {deletingId === block.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
