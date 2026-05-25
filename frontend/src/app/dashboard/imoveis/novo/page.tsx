'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PropertyForm from '@/app/dashboard/_components/property-form'
import { createProperty } from '@/lib/property'
import type { AxiosError } from 'axios'

export default function NovoImovelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setServerErrors({})
    try {
      const property = await createProperty(data as unknown as Parameters<typeof createProperty>[0])
      router.push(`/dashboard/imoveis/${property.id}`)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>
      if (axiosErr.response?.data?.errors) {
        setServerErrors(axiosErr.response.data.errors)
      } else {
        setServerErrors({ form: [axiosErr.response?.data?.message ?? 'Erro ao salvar. Tente novamente.'] })
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/imoveis"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para Imóveis
      </Link>

      <div>
        <h1 className="text-lg font-semibold text-text-primary">Novo Imóvel</h1>
        <p className="text-sm text-text-secondary">Cadastre um novo imóvel para começar a receber reservas</p>
      </div>

      {serverErrors.form && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-sm text-error font-medium text-center">
          {serverErrors.form[0]}
        </div>
      )}

      <PropertyForm
        initialData={null}
        onSubmit={handleSubmit}
        loading={loading}
        serverErrors={serverErrors}
      />
    </div>
  )
}
