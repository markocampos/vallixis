import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/api'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    // Verify session on mount
    setLoading(true)
    api
      .get<{ data: AuthUser }>('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
  }, [setLoading, setUser])

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      storeLogout()
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
