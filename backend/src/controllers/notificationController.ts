import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import crypto from 'crypto'

const ACTION_LABELS: Record<string, { title: string; body: string }> = {
  register: { title: 'Account created', body: 'Your account has been created successfully.' },
  login: { title: 'Signed in', body: 'You logged in to your account.' },
  logout: { title: 'Signed out', body: 'You logged out of your account.' },
  verify_email: { title: 'Email verified', body: 'Your email address has been verified.' },
  reset_password: { title: 'Password changed', body: 'Your password has been updated.' },
  site_created: { title: 'Site created', body: 'A new site has been created and is being built.' },
  site_deleted: { title: 'Site deleted', body: 'A site has been permanently deleted.' },
  subscription_activated: { title: 'Subscription active', body: 'Your subscription is now active.' },
  subscription_cancelled: { title: 'Subscription cancelled', body: 'Your subscription has been cancelled.' },
  bot_attempt: { title: 'Security alert', body: 'A suspicious login attempt was blocked.' },
}

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50)

    const result = await db.query(
      `SELECT id, action, details, created_at
       FROM audit_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    )

    const notifications = result.rows.map((row: any) => {
      const label = ACTION_LABELS[row.action] || { title: row.action, body: '' }
      const timeAgo = getTimeAgo(row.created_at)

      return {
        id: row.id,
        title: label.title,
        body: label.body,
        action: row.action,
        time: timeAgo,
        timestamp: row.created_at,
        read: false
      }
    })

    res.json({
      success: true,
      data: notifications,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    const result = await db.query(
      `SELECT COUNT(*) as count
       FROM audit_logs
       WHERE user_id = $1
       AND created_at > NOW() - INTERVAL '7 days'`,
      [userId]
    )

    const count = parseInt(result.rows[0]?.count || '0')

    res.json({
      success: true,
      data: { count },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

function getTimeAgo(date: Date): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}
