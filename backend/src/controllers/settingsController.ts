import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import crypto from 'crypto'

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    const result = await db.query(
      `SELECT id, name, email, plan, status, role, email_verified, created_at, last_login
       FROM users WHERE id = $1`,
      [userId]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(404, 'User not found')
    }

    const user = result.rows[0]

    // Decrypt email for display
    let email = user.email
    try {
      const { decrypt } = await import('../utils/crypto')
      email = decrypt(user.email)
    } catch {
      // use as-is
    }

    res.json({
      success: true,
      data: { ...user, email },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { name } = req.body

    if (!name || name.trim().length < 1) {
      throw new AppError(400, 'Name is required')
    }

    await db.query(
      'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2',
      [name.trim(), userId]
    )

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, 'profile_updated', req.ip, req.headers['user-agent'] || '']
    )

    res.json({
      success: true,
      data: { name: name.trim() },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'Current and new passwords are required')
    }

    if (newPassword.length < 8) {
      throw new AppError(400, 'New password must be at least 8 characters')
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw new AppError(400, 'New password must contain uppercase, lowercase, and number')
    }

    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId])
    const user = userResult.rows[0]

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) {
      throw new AppError(400, 'Current password is incorrect')
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, userId]
    )

    // Revoke all refresh tokens
    await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1', [userId])

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, 'password_changed', req.ip, req.headers['user-agent'] || '']
    )

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const requestDeletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { confirmation } = req.body

    if (confirmation !== 'DELETE') {
      throw new AppError(400, 'Type DELETE to confirm')
    }

    const scheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await db.query(
      `UPDATE users
       SET status = 'pending_deletion',
           deletion_requested_at = NOW(),
           deletion_scheduled_at = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [scheduledAt, userId]
    )

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, 'deletion_requested', req.ip, req.headers['user-agent'] || '']
    )

    res.json({
      success: true,
      data: { scheduledAt: scheduledAt.toISOString() },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const cancelDeletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    await db.query(
      `UPDATE users
       SET status = 'active',
           deletion_requested_at = NULL,
           deletion_scheduled_at = NULL,
           updated_at = NOW()
       WHERE id = $1 AND status = 'pending_deletion'`,
      [userId]
    )

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, 'deletion_cancelled', req.ip, req.headers['user-agent'] || '']
    )

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    const user = await db.query('SELECT id, name, email, plan, status, created_at FROM users WHERE id = $1', [userId])
    const sites = await db.query('SELECT id, name, slug, template, status, created_at FROM sites WHERE user_id = $1', [userId])
    const invoices = await db.query('SELECT id, amount, currency, description, status, created_at FROM invoices WHERE user_id = $1', [userId])

    let email = user.rows[0]?.email || ''
    try {
      const { decrypt } = await import('../utils/crypto')
      email = decrypt(email)
    } catch {}

    const data = {
      exported_at: new Date().toISOString(),
      user: { ...user.rows[0], email },
      sites: sites.rows,
      invoices: invoices.rows
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="vallixis-export-${new Date().toISOString().slice(0,10)}.json"`)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
