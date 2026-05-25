import api from './api'

export interface ReviewGuest {
  id: number
  name: string
  avatar: string | null
}

export interface ReviewResource {
  id: number
  property_id: number
  guest_id: number
  reservation_id: number
  rating: number
  comment: string
  host_reply: string | null
  guest: ReviewGuest | null
  created_at: string
  updated_at: string
}

export interface ReviewListResponse {
  data: ReviewResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    average_rating: number
  }
}

export interface CreateReviewData {
  reservation_id: number
  rating: number
  comment: string
}

export async function fetchPropertyReviews(propertyId: number): Promise<ReviewListResponse> {
  const { data } = await api.get<ReviewListResponse>(`/properties/${propertyId}/reviews`)
  return data
}

export async function createReview(propertyId: number, data: CreateReviewData): Promise<ReviewResource> {
  const response = await api.post<ReviewResource>(`/properties/${propertyId}/reviews`, data)
  return response.data
}

export async function updateReview(id: number, data: Partial<CreateReviewData>): Promise<ReviewResource> {
  const response = await api.put<ReviewResource>(`/reviews/${id}`, data)
  return response.data
}

export async function deleteReview(id: number): Promise<void> {
  await api.delete(`/reviews/${id}`)
}
