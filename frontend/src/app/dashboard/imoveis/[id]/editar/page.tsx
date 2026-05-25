'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import PropertyForm from '@/app/dashboard/_components/property-form'
import { fetchProperty, updateProperty, type PropertyResource } from '@/lib/property'
import type { AxiosError } from 'axios'

export default function EditarImovelPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [property, setProperty] = useState<PropertyResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (isNaN(id)) {
      notFound()
      return
    }

    let cancelled = false
    setLoading(true)

    fetchProperty(id)
      .then((data) => {
        if (!cancelled) setProperty(data)
      })
      .catch((err) => {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            notFound()
          } else {
            setError(err?.response?.data?.message ?? 'Erro ao carregar imóvel')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    setSaving(true)
    setServerErrors({})
    try {
      await updateProperty(id, data as unknown as Parameters<typeof updateProperty>[1])
      router.push(`/dashboard/imoveis/${id}`)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>
      if (axiosErr.response?.data?.errors) {
        setServerErrors(axiosErr.response.data.errors)
      } else {
        setServerErrors({ form: [axiosErr.response?.data?.message ?? 'Erro ao salvar. Tente novamente.'] })
      }
    } finally {
      setSaving(false)
    }
  }, [id, router])

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-4 bg-tertiary rounded w-32" />
        <div className="h-6 bg-tertiary rounded w-48" />
        <div className="h-64 bg-tertiary rounded-xl" />
        <div className="h-48 bg-tertiary rounded-xl" />
        <div className="h-32 bg-tertiary rounded-xl" />
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

  return (
    <div className="space-y-5">
      <Link
        href={`/dashboard/imoveis/${property.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para {property.title}
      </Link>

      <div>
        <h1 className="text-lg font-semibold text-text-primary">Editar Imóvel</h1>
        <p className="text-sm text-text-secondary">{property.title}</p>
      </div>

      {serverErrors.form && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-sm text-error font-medium text-center">
          {serverErrors.form[0]}
        </div>
      )}

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        loading={saving}
        serverErrors={serverErrors}
      />
    </div>
  )
}
