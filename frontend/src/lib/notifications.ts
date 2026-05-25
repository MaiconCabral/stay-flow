import api from './api'

export interface Notification {
  id: number
  type: string
  title: string
  message: string | null
  data: Record<string, unknown> | null
  read: boolean
  read_at: string | null
  created_at: string
  updated_at: string
}

export interface NotificationsResponse {
  data: Notification[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export async function fetchNotifications(params?: {
  type?: string
  unread?: boolean
  per_page?: number
}): Promise<NotificationsResponse> {
  const { data } = await api.get<NotificationsResponse>('/notifications', { params })
  return data
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/notifications/unread-count')
  return data.count
}

export async function markAsRead(id: number): Promise<Notification> {
  const { data } = await api.post<Notification>(`/notifications/${id}/read`)
  return data
}

export async function markAllAsRead(): Promise<void> {
  await api.post('/notifications/read-all')
}
