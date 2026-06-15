import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import crypto from 'crypto'

const PLAN_LIMITS: Record<string, { name: string; sites: number; storage: number; bandwidth: number; emails: number }> = {
  free: { name: 'Free', sites: 1, storage: 50, bandwidth: 1, emails: 0 },
  founder: { name: 'Founder', sites: 1, storage: 500, bandwidth: 10, emails: 1 },
  starter: { name: 'Starter', sites: 1, storage: 500, bandwidth: 10, emails: 1 },
  maker: { name: 'Maker', sites: 3, storage: 2048, bandwidth: 50, emails: 3 },
  pro: { name: 'Pro', sites: 10, storage: 10240, bandwidth: 200, emails: -1 }
}

export const getBillingInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    const userResult = await db.query(
      'SELECT plan, status, paymongo_subscription_id, founder_pricing_eligible, created_at FROM users WHERE id = $1',
      [userId]
    )

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'User not found' }],
        meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
      })
    }

    const user = userResult.rows[0]
    const planKey = user.plan || 'free'
    const limits = PLAN_LIMITS[planKey] || PLAN_LIMITS.free

    // Get usage from sites
    const usageResult = await db.query(
      `SELECT
         COUNT(*) as site_count,
         COALESCE(SUM(storage_used_mb), 0) as total_storage,
         COALESCE(SUM(bandwidth_used_mb), 0) as total_bandwidth
       FROM sites WHERE user_id = $1`,
      [userId]
    )

    const usage = usageResult.rows[0]

    // Get invoice count
    const invoiceResult = await db.query(
      'SELECT COUNT(*) as count FROM invoices WHERE user_id = $1',
      [userId]
    )

    res.json({
      success: true,
      data: {
        plan: {
          key: planKey,
          name: limits.name,
          status: user.status,
          subscribed_at: user.created_at,
          subscription_id: user.paymongo_subscription_id,
          founder_eligible: user.founder_pricing_eligible
        },
        limits: {
          sites: limits.sites,
          storage_mb: limits.storage,
          bandwidth_gb: limits.bandwidth,
          emails: limits.emails
        },
        usage: {
          sites: parseInt(usage.site_count),
          storage_mb: parseInt(usage.total_storage),
          bandwidth_mb: parseInt(usage.total_bandwidth)
        },
        invoices: {
          count: parseInt(invoiceResult.rows[0]?.count || '0')
        }
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50)

    const result = await db.query(
      `SELECT id, amount, currency, description, status, billing_period_start, billing_period_end, receipt_url, created_at, paid_at
       FROM invoices
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    )

    res.json({
      success: true,
      data: result.rows,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getFounderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query('SELECT * FROM founder_pricing LIMIT 1')
    const fp = result.rows[0]

    if (!fp) {
      return res.json({
        success: true,
        data: { isActive: false, seatsTotal: 0, seatsClaimed: 0, seatsRemaining: 0 },
        meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
      })
    }

    res.json({
      success: true,
      data: {
        isActive: fp.is_active,
        seatsTotal: fp.total_seats,
        seatsClaimed: fp.seats_claimed,
        seatsRemaining: fp.total_seats - fp.seats_claimed
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}
