'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Check, Loader2, ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { PropertyResource } from '@/lib/property'
import { buscarCep, formatCep } from '@/lib/cep'
import MapPicker from '@/components/MapPicker'

const propertyTypeOptions = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'villa', label: 'Vila' },
  { value: 'cabin', label: 'Cabana' },
  { value: 'cottage', label: 'Chalé' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Outro' },
]

const spaceTypeOptions = [
  { value: 'entire_place', label: 'Espaço inteiro' },
  { value: 'private_room', label: 'Quarto privado' },
  { value: 'shared_room', label: 'Quarto compartilhado' },
]

const statusOptions = [
  { value: 'available', label: 'Disponível' },
  { value: 'unavailable', label: 'Indisponível' },
  { value: 'pending', label: 'Pendente' },
]

export interface PropertyFormData {
  title: string
  description: string
  property_type: string
  type: string
  status: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  price_per_night: number
  cleaning_fee: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  check_in_time: string
  check_out_time: string
  latitude: string
  longitude: string
}

function toFormData(property?: PropertyResource | null): PropertyFormData {
  return {
    title: property?.title ?? '',
    description: property?.description ?? '',
    property_type: property?.property_type ?? '',
    type: property?.type ?? 'entire_place',
    status: property?.status ?? 'available',
    address: property?.address ?? '',
    city: property?.city ?? '',
    state: property?.state ?? '',
    country: property?.country ?? 'Brasil',
    zip_code: property?.zip_code ?? '',
    price_per_night: property?.price_per_night ?? 0,
    cleaning_fee: property?.cleaning_fee ?? 0,
    max_guests: property?.max_guests ?? 1,
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    check_in_time: property?.check_in_time ?? '',
    check_out_time: property?.check_out_time ?? '',
    latitude: property?.latitude?.toString() ?? '',
    longitude: property?.longitude?.toString() ?? '',
  }
}

function InputField({ label, value, onChange, type = 'text', placeholder, error, min }: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  error?: string
  min?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full px-3 py-2.5 rounded-lg bg-surface border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
          error ? 'border-error' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

function TextareaField({ label, value, onChange, placeholder, error }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-3 py-2.5 rounded-lg bg-surface border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${
          error ? 'border-error' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, options, error }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg bg-surface border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )
}

export default function PropertyForm({ initialData, onSubmit, loading, serverErrors }: {
  initialData?: PropertyResource | null
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  loading: boolean
  serverErrors: Record<string, string[]>
}) {
  const [form, setForm] = useState<PropertyFormData>(() => toFormData(initialData))
  const [showCoords, setShowCoords] = useState(false)
  const [saved, setSaved] = useState(false)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')

  useEffect(() => {
    setForm(toFormData(initialData))
  }, [initialData])

  const update = useCallback((field: keyof PropertyFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setLocalErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const numeric = useCallback((field: keyof PropertyFormData, value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    update(field, num)
  }, [update])

  const handleCepChange = useCallback((value: string) => {
    const formatted = formatCep(value)
    update('zip_code', formatted)
    setCepError('')
  }, [update])

  const handleCepSearch = useCallback(async () => {
    const digits = form.zip_code.replace(/\D/g, '')
    if (digits.length !== 8) {
      setCepError('CEP incompleto (8 dígitos)')
      return
    }

    setCepLoading(true)
    setCepError('')

    try {
      const result = await buscarCep(form.zip_code)
      setForm((prev) => ({
        ...prev,
        address: result.address || prev.address,
        city: result.city || prev.city,
        state: result.state || prev.state,
        country: result.country || prev.country,
        zip_code: result.zip_code,
      }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar CEP'
      setCepError(msg)
    } finally {
      setCepLoading(false)
    }
  }, [form.zip_code])

  const handleMapChange = useCallback((lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Título é obrigatório'
    if (!form.description.trim()) errs.description = 'Descrição é obrigatória'
    if (!form.property_type) errs.property_type = 'Tipo de imóvel é obrigatório'
    if (!form.price_per_night || Number(form.price_per_night) <= 0) errs.price_per_night = 'Valor mínimo é R$ 1'
    if (!form.max_guests || Number(form.max_guests) < 1) errs.max_guests = 'Mínimo de 1 hóspede'
    if (!form.bedrooms || Number(form.bedrooms) < 0) errs.bedrooms = 'Valor inválido'
    if (!form.bathrooms || Number(form.bathrooms) < 0) errs.bathrooms = 'Valor inválido'
    setLocalErrors(errs)
    return Object.keys(errs).length === 0
  }, [form])

  const handleSubmit = useCallback(async () => {
    if (!validate()) return
    setSaved(false)

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      description: form.description.trim(),
      property_type: form.property_type,
      type: form.type,
      status: form.status,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      country: form.country.trim() || null,
      zip_code: form.zip_code.trim() || null,
      price_per_night: Number(form.price_per_night),
      cleaning_fee: Number(form.cleaning_fee) || null,
      max_guests: Number(form.max_guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      check_in_time: form.check_in_time || null,
      check_out_time: form.check_out_time || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    }

    await onSubmit(payload)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [form, validate, onSubmit])

  const allErrors = { ...localErrors }
  for (const [key, msgs] of Object.entries(serverErrors)) {
    allErrors[key] = msgs[0]
  }

  const latNum = form.latitude ? Number(form.latitude) : null
  const lngNum = form.longitude ? Number(form.longitude) : null
  const hasCoords = latNum !== null && lngNum !== null

  return (
    <div className="space-y-5">
      <SectionCard title="Informações Básicas">
        <div className="sm:col-span-2">
          <InputField
            label="Título *"
            value={form.title}
            onChange={(v) => update('title', v)}
            placeholder="Ex: Casa na Praia com Vista para o Mar"
            error={allErrors.title}
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            label="Descrição *"
            value={form.description}
            onChange={(v) => update('description', v)}
            placeholder="Descreva o imóvel, seus diferenciais e o que os hóspedes podem esperar..."
            error={allErrors.description}
          />
        </div>
        <SelectField
          label="Tipo de Imóvel *"
          value={form.property_type}
          onChange={(v) => update('property_type', v)}
          options={propertyTypeOptions}
          error={allErrors.property_type}
        />
        <SelectField
          label="Tipo de Espaço"
          value={form.type}
          onChange={(v) => update('type', v)}
          options={spaceTypeOptions}
        />
        <SelectField
          label="Status"
          value={form.status}
          onChange={(v) => update('status', v)}
          options={statusOptions}
        />
      </SectionCard>

      <SectionCard title="Localização">
        <div className="sm:col-span-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputField
                label="CEP"
                value={form.zip_code}
                onChange={handleCepChange}
                placeholder="00000-000"
                error={cepError || allErrors.zip_code}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleCepSearch}
                disabled={cepLoading || form.zip_code.replace(/\D/g, '').length < 8}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {cepLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Buscar
              </button>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <InputField
            label="Endereço"
            value={form.address}
            onChange={(v) => update('address', v)}
            placeholder="Rua, número, bairro"
          />
        </div>
        <InputField
          label="Cidade"
          value={form.city}
          onChange={(v) => update('city', v)}
          placeholder="Ex: Ubatuba"
        />
        <InputField
          label="Estado"
          value={form.state}
          onChange={(v) => update('state', v)}
          placeholder="Ex: SP"
        />
        <InputField
          label="País"
          value={form.country}
          onChange={(v) => update('country', v)}
          placeholder="Brasil"
        />
      </SectionCard>

      <SectionCard title="Preços">
        <InputField
          label="Diária (R$) *"
          value={form.price_per_night}
          onChange={(v) => numeric('price_per_night', v)}
          placeholder="250"
          type="number"
          min={1}
          error={allErrors.price_per_night}
        />
        <InputField
          label="Taxa de Limpeza (R$)"
          value={form.cleaning_fee}
          onChange={(v) => numeric('cleaning_fee', v)}
          placeholder="100"
          type="number"
          min={0}
        />
      </SectionCard>

      <SectionCard title="Capacidade">
        <InputField
          label="Máx. de Hóspedes *"
          value={form.max_guests}
          onChange={(v) => numeric('max_guests', v)}
          placeholder="4"
          type="number"
          min={1}
          error={allErrors.max_guests}
        />
        <InputField
          label="Quartos *"
          value={form.bedrooms}
          onChange={(v) => numeric('bedrooms', v)}
          placeholder="2"
          type="number"
          min={0}
          error={allErrors.bedrooms}
        />
        <InputField
          label="Banheiros *"
          value={form.bathrooms}
          onChange={(v) => numeric('bathrooms', v)}
          placeholder="1"
          type="number"
          min={0}
          error={allErrors.bathrooms}
        />
      </SectionCard>

      <SectionCard title="Horários">
        <InputField
          label="Check-in"
          value={form.check_in_time}
          onChange={(v) => update('check_in_time', v)}
          type="time"
        />
        <InputField
          label="Check-out"
          value={form.check_out_time}
          onChange={(v) => update('check_out_time', v)}
          type="time"
        />
      </SectionCard>

      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setShowCoords((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
        >
          {showCoords ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          Coordenadas Geográficas
          {hasCoords && (
            <span className="text-xs text-text-secondary font-normal ml-1">
              ({latNum}, {lngNum})
            </span>
          )}
        </button>
        {showCoords && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            <MapPicker
              latitude={latNum}
              longitude={lngNum}
              onChange={handleMapChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Latitude"
                value={form.latitude}
                onChange={(v) => update('latitude', v)}
                placeholder="-23.5505"
                type="number"
              />
              <InputField
                label="Longitude"
                value={form.longitude}
                onChange={(v) => update('longitude', v)}
                placeholder="-46.6333"
                type="number"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {loading ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}
