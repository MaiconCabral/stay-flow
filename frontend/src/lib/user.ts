import api from './api'
import type { User } from './auth'

interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  password?: string
  avatar?: string
  is_host?: boolean
}

export async function updateUser(id: number, data: UpdateUserData): Promise<User> {
  const { data: user } = await api.put<User>(`/users/${id}`, data)
  return user
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}
