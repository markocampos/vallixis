export const APP_NAME = 'Vallixis'
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const PLANS = {
  free: { name: 'Free', price: 0, displayPrice: 'P0', sites: 1, storage: 50, bandwidth: 1 },
  starter: { name: 'Starter', price: 25000, displayPrice: 'P250', sites: 1, storage: 500, bandwidth: 10 },
  maker: { name: 'Maker', price: 60000, displayPrice: 'P600', sites: 3, storage: 2048, bandwidth: 50 },
  pro: { name: 'Pro', price: 125000, displayPrice: 'P1,250', sites: 10, storage: 10240, bandwidth: 200 }
} as const

export const FOUNDER_PRICE = 15000 // P150 in centavos

export const TEMPLATES = ['business', 'portfolio', 'ecommerce'] as const
export const VIBES = ['warm', 'modern', 'bold', 'minimal'] as const

export const SITE_STATUS_LABELS: Record<string, string> = {
  live: 'Live',
  pending: 'Pending',
  building: 'Building',
  suspended: 'Suspended',
  error: 'Error'
}

export const formatPHP = (centavos: number): string =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(centavos / 100)
