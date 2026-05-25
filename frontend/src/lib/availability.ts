import api from './api'

export interface AvailabilityResource {
  id: number
  property_id: number
  start_date: string
  end_date: string
  is_available: boolean
  reason: string | null
  created_at: string
  updated_at: string
}

export interface AvailabilityListResponse {
  data: AvailabilityResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface AvailabilityQueryParams {
  property_id?: number
  is_available?: boolean
  date_from?: string
  date_to?: string
  price_min?: number
  price_max?: number
  sort_field?: string
  sort_direction?: string
  per_page?: number
  page?: number
}

export interface CheckAvailabilityResult {
  is_available: boolean
  property_id: number
  start_date: string
  end_date: string
  blocking_availability: {
    id: number
    start_date: string
    end_date: string
    is_available: boolean
  }[]
  has_reservation_overlap: boolean
}

export interface CreateAvailabilityData {
  property_id: number
  start_date: string
  end_date: string
  is_available: boolean
  reason?: string
}

export async function fetchAvailabilities(params?: AvailabilityQueryParams): Promise<AvailabilityListResponse> {
  const { data } = await api.get<AvailabilityListResponse>('/availabilities', { params })
  return data
}

export async function fetchAvailability(id: number): Promise<AvailabilityResource> {
  const { data } = await api.get<AvailabilityResource>(`/availabilities/${id}`)
  return data
}

export async function createAvailability(data: CreateAvailabilityData): Promise<AvailabilityResource> {
  const response = await api.post<AvailabilityResource>('/availabilities', data)
  return response.data
}

export async function updateAvailability(id: number, data: Partial<CreateAvailabilityData>): Promise<AvailabilityResource> {
  const response = await api.put<AvailabilityResource>(`/availabilities/${id}`, data)
  return response.data
}

export async function deleteAvailability(id: number): Promise<void> {
  await api.delete(`/availabilities/${id}`)
}

export async function checkAvailability(
  propertyId: number,
  startDate: string,
  endDate: string
): Promise<CheckAvailabilityResult> {
  const { data } = await api.get<{ data: CheckAvailabilityResult }>('/availabilities/check', {
    params: { property_id: propertyId, start_date: startDate, end_date: endDate },
  })
  return data.data
}
