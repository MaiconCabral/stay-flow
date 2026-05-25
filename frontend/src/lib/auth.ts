import api from './api'

export interface User {
  id: number
  name: string
  email: string
  role: string | null
  role_label: string | null
  phone: string | null
  avatar: string | null
  is_host: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

interface AuthResponse {
  user: User
  token: string
}

export function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem('auth_user')
  return raw ? JSON.parse(raw) : null
}

export function setSession(user: User, token: string): void {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
}

export function clearSession(): void {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  setSession(data.user, data.token)
  return data
}

export async function register(params: {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', params)
  setSession(data.user, data.token)
  return data
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    clearSession()
  }
}

export async function fetchUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}
