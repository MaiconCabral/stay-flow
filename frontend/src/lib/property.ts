import api from './api'

export interface CoverImage {
  id: number
  image_url: string
}

export interface PropertyImage {
  id: number
  image_url: string
  is_cover: boolean
  order: number
}

export interface HostInfo {
  id: number
  name: string
  avatar: string | null
}

export interface PropertyResource {
  id: number
  host_id: number
  title: string
  slug: string
  type: string
  description: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  property_type: string
  property_type_label: string
  price_per_night: number
  cleaning_fee: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  latitude: number | null
  longitude: number | null
  status: string
  status_label: string
  check_in_time: string | null
  check_out_time: string | null
  cover_image: CoverImage | null
  images: PropertyImage[]
  host: HostInfo | null
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PropertyListResponse {
  data: PropertyResource[]
  meta: PaginationMeta
}

export interface PropertyQueryParams {
  search?: string
  city?: string
  state?: string
  property_type?: string
  status?: string
  price_min?: number
  price_max?: number
  max_guests?: number
  bedrooms?: number
  sort_field?: string
  sort_direction?: string
  per_page?: number
  page?: number
}

export async function fetchProperties(params?: PropertyQueryParams): Promise<PropertyListResponse> {
  const { data } = await api.get<PropertyListResponse>('/properties', { params })
  return data
}

export async function fetchProperty(id: number): Promise<PropertyResource> {
  const { data } = await api.get<PropertyResource>(`/properties/${id}`)
  return data
}

export interface StorePropertyData {
  title: string
  description?: string
  type?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zip_code?: string
  property_type?: string
  price_per_night: number
  cleaning_fee?: number
  max_guests?: number
  bedrooms?: number
  bathrooms?: number
  latitude?: number
  longitude?: number
  status?: string
  check_in_time?: string
  check_out_time?: string
}

export async function createProperty(data: StorePropertyData): Promise<PropertyResource> {
  const response = await api.post<PropertyResource>('/properties', data)
  return response.data
}

export async function updateProperty(id: number, data: Partial<StorePropertyData>): Promise<PropertyResource> {
  const response = await api.put<PropertyResource>(`/properties/${id}`, data)
  return response.data
}

export async function deleteProperty(id: number): Promise<void> {
  await api.delete(`/properties/${id}`)
}

export interface UploadedImage {
  id: number
  image_url: string
  is_cover: boolean
  order: number
}

export async function uploadPropertyImage(propertyId: number, file: File, isCover?: boolean): Promise<UploadedImage> {
  const formData = new FormData()
  formData.append('image', file)
  if (isCover) formData.append('is_cover', '1')
  const { data } = await api.post<UploadedImage>(`/properties/${propertyId}/images`, formData)
  return data
}

export async function deletePropertyImage(propertyId: number, imageId: number): Promise<void> {
  await api.delete(`/properties/${propertyId}/images/${imageId}`)
}

export async function setPropertyImageCover(propertyId: number, imageId: number): Promise<void> {
  await api.put(`/properties/${propertyId}/images/${imageId}/cover`)
}
