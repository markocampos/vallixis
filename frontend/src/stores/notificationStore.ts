import { create } from 'zustand'
import api from '../lib/api'

export interface Notification {
  id: string
  title: string
  body: string
  action: string
  time: string
  timestamp: string
  read: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  loading: boolean
  fetchNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
  togglePanel: () => void
  closePanel: () => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true })
    try {
      const res = await api.get<{ data: Notification[] }>('/notifications', { params: { limit: 15 } })
      set({ notifications: res.data.data || [] })
    } catch {
      // ignore
    } finally {
      set({ loading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get<{ data: { count: number } }>('/notifications/unread-count')
      set({ unreadCount: res.data.data?.count || 0 })
    } catch {
      // ignore
    }
  },

  togglePanel: () => {
    const { isOpen } = get()
    if (!isOpen) {
      get().fetchNotifications()
    }
    set({ isOpen: !isOpen })
  },

  closePanel: () => set({ isOpen: false }),

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0
    }))
  }
}))
