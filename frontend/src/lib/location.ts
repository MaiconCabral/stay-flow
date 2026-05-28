import api from './api'

export interface LocationResult {
  city: string
  state: string
  property_count: number
}

export async function fetchLocations(search?: string): Promise<LocationResult[]> {
  const { data } = await api.get<{ data: LocationResult[] }>('/properties/locations', {
    params: { q: search || undefined },
  })
  return data.data
}
