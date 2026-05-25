import api from './api'

export interface ReservationGuest {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface ReservationProperty {
  id: number
  title: string
  slug: string
  city: string
  state: string
  property_type: string
  property_type_label: string
  price_per_night: number
  max_guests: number
  cover_image: { id: number; image_url: string } | null
}

export interface ReservationPayment {
  id: number
  amount: number
  status: string
  payment_method: string
}

export interface ReservationResource {
  id: number
  property_id: number
  guest_id: number
  check_in: string
  check_out: string
  total_guests: number
  subtotal: number
  service_fee: number
  cleaning_fee: number
  total_price: number
  status: string
  status_label: string
  cancelled_at: string | null
  cancelled_reason: string | null
  notes: string | null
  property: ReservationProperty | null
  guest: ReservationGuest | null
  payment: ReservationPayment | null
  created_at: string
  updated_at: string
}

export interface ReservationListResponse {
  data: ReservationResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ReservationQueryParams {
  status?: string
  property_id?: number
  guest_id?: number
  check_in_from?: string
  check_in_to?: string
  check_out_from?: string
  check_out_to?: string
  date_from?: string
  date_to?: string
  price_min?: number
  price_max?: number
  sort_field?: string
  sort_direction?: string
  per_page?: number
  page?: number
}

export async function fetchReservations(params?: ReservationQueryParams): Promise<ReservationListResponse> {
  const { data } = await api.get<ReservationListResponse>('/reservations', { params })
  return data
}

export async function fetchReservation(id: number): Promise<ReservationResource> {
  const { data } = await api.get<ReservationResource>(`/reservations/${id}`)
  return data
}

export interface CreateReservationData {
  property_id: number
  check_in: string
  check_out: string
  total_guests: number
  subtotal?: number
  service_fee?: number
  cleaning_fee?: number
  total_price?: number
  notes?: string
}

export async function createReservation(data: CreateReservationData): Promise<ReservationResource> {
  const response = await api.post<ReservationResource>('/reservations', data)
  return response.data
}

export async function updateReservation(id: number, data: Partial<CreateReservationData>): Promise<ReservationResource> {
  const response = await api.put<ReservationResource>(`/reservations/${id}`, data)
  return response.data
}

export async function deleteReservation(id: number): Promise<void> {
  await api.delete(`/reservations/${id}`)
}

export async function cancelReservation(id: number, reason: string): Promise<ReservationResource> {
  const response = await api.post<ReservationResource>(`/reservations/${id}/cancel`, { reason })
  return response.data
}
