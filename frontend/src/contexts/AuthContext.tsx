'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  fetchUser,
  getStoredToken,
  getStoredUser,
  setSession,
  clearSession,
  type User,
} from '@/lib/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (params: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = getStoredToken()
    const storedUser = getStoredUser()

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)

    if (storedUser) {
      setUser(storedUser)
    }

    fetchUser()
      .then((freshUser) => {
        setUser(freshUser)
        localStorage.setItem('auth_user', JSON.stringify(freshUser))
      })
      .catch(() => {
        clearSession()
        setUser(null)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin(email, password)
      setUser(data.user)
      setToken(data.token)
      router.push('/dashboard')
    },
    [router],
  )

  const register = useCallback(
    async (params: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => {
      const data = await apiRegister(params)
      setUser(data.user)
      setToken(data.token)
      router.push('/dashboard')
    },
    [router],
  )

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
    setToken(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: !!token && !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
