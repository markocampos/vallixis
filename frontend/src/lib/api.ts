import axios from 'axios'
import type { ApiResponse } from '../types'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: add idempotency key
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch'].includes(config.method || '')) {
    config.headers['X-Idempotency-Key'] = crypto.randomUUID()
  }
  return config
})

// Response interceptor: handle 401 refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )
        return api(original)
      } catch {
        // Prevent infinite loops by not using window.location.href directly.
        // Instead, we just reject the promise. The AuthContext and ProtectedRoutes
        // will handle redirecting the user appropriately.
        return Promise.reject(error)
      }
    }
    if (error.response?.status === 429) {
      // Too many requests - handled by toast in component
    }
    return Promise.reject(error)
  }
)

export default api

export function makeResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
  }
}
