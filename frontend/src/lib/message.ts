import api from './api'

export interface MessageSender {
  id: number
  name: string
  avatar: string | null
}

export interface MessageResource {
  id: number
  conversation_id: number
  sender_id: number
  content: string
  read_at: string | null
  sender: MessageSender | null
  is_mine: boolean
  created_at: string
}

export interface MessageListResponse {
  data: MessageResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ConversationProperty {
  id: number
  title: string
  slug: string
  city: string
  state: string
}

export interface ConversationGuest {
  id: number
  name: string
  avatar: string | null
}

export interface ConversationHost {
  id: number
  name: string
  avatar: string | null
}

export interface ConversationLastMessage {
  id: number
  content: string
  sender_id: number
  created_at: string
}

export interface ConversationResource {
  id: number
  property_id: number
  guest_id: number
  host_id: number
  reservation_id: number | null
  status: string
  status_label: string
  last_message_at: string | null
  last_message_preview: string | null
  unread_count: number
  property: ConversationProperty | null
  guest: ConversationGuest | null
  host: ConversationHost | null
  last_message: ConversationLastMessage | null
  created_at: string
  updated_at: string
}

export interface ConversationListResponse {
  data: ConversationResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ConversationQueryParams {
  status?: string
  sort_field?: string
  sort_direction?: string
  per_page?: number
  page?: number
}

export interface MessageQueryParams {
  per_page?: number
  page?: number
}

export async function fetchConversations(params?: ConversationQueryParams): Promise<ConversationListResponse> {
  const { data } = await api.get<ConversationListResponse>('/conversations', { params })
  return data
}

export async function fetchConversation(id: number): Promise<ConversationResource> {
  const { data } = await api.get<ConversationResource>(`/conversations/${id}`)
  return data
}

export interface StartConversationData {
  property_id: number
  reservation_id?: number
  content: string
}

export async function startConversation(payload: StartConversationData): Promise<ConversationResource> {
  const { data } = await api.post<ConversationResource>('/conversations', payload)
  return data
}

export async function fetchMessages(conversationId: number, params?: MessageQueryParams): Promise<MessageListResponse> {
  const { data } = await api.get<MessageListResponse>(`/conversations/${conversationId}/messages`, { params })
  return data
}

export async function sendMessage(conversationId: number, content: string): Promise<MessageResource> {
  const { data } = await api.post<MessageResource>(`/conversations/${conversationId}/messages`, { content })
  return data
}

export async function markMessageAsRead(messageId: number): Promise<MessageResource> {
  const { data } = await api.post<MessageResource>(`/messages/${messageId}/read`)
  return data
}

export async function markConversationAsRead(conversationId: number): Promise<void> {
  await api.post(`/conversations/${conversationId}/read`)
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<{ unread_count: number }>('/messages/unread-count')
  return data.unread_count
}
