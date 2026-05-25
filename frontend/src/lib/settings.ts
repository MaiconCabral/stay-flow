import api from './api'

export interface NotificationSettings {
  new_booking: boolean
  cancellations: boolean
  messages: boolean
  reviews: boolean
  reminders: boolean
  weekly_report: boolean
}

export interface PayoutSettings {
  method: 'pix' | 'ted' | 'paypal'
  pix_key: string
  bank: string
  agency: string
  account: string
  paypal_email: string
  threshold: number
  schedule: 'daily' | 'weekly' | 'monthly'
}

export interface UserSettings {
  notifications: NotificationSettings
  payout: PayoutSettings
}

export async function fetchSettings(): Promise<UserSettings> {
  const { data } = await api.get<UserSettings>('/settings')
  return data
}

export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>,
): Promise<NotificationSettings> {
  const { data } = await api.put<NotificationSettings>('/settings/notifications', settings)
  return data
}

export async function updatePayoutSettings(
  settings: Partial<PayoutSettings>,
): Promise<PayoutSettings> {
  const { data } = await api.put<PayoutSettings>('/settings/payout', settings)
  return data
}
