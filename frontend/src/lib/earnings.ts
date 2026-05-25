import api from './api'

export interface EarningsSummary {
  total_revenue: number
  net_revenue: number
  average_ticket: number
  pending_payouts: number
  revenue_change: number
}

export interface EarningsMonthly {
  month: number
  year: number
  gross: number
  fees: number
  net: number
  booking_count: number
}

export interface EarningsByProperty {
  property_id: number
  property_name: string
  gross: number
  fees: number
  net: number
  booking_count: number
}

export interface EarningsTransaction {
  id: number
  booking_id: string
  guest_name: string
  property_name: string
  check_out: string
  gross_amount: number
  fee: number
  net_amount: number
  status: string
  payment_status: string | null
}

export interface EarningsData {
  summary: EarningsSummary
  monthly: EarningsMonthly[]
  by_property: EarningsByProperty[]
  transactions: EarningsTransaction[]
}

export interface EarningsQueryParams {
  months?: number
  property_id?: number
}

export async function fetchEarnings(params?: EarningsQueryParams): Promise<EarningsData> {
  const { data } = await api.get<EarningsData>('/earnings', { params })
  return data
}
