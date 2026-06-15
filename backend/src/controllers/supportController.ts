import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import crypto from 'crypto'

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { subject, message, siteId, priority } = req.body

    if (!subject || !message) {
      throw new AppError(400, 'Subject and message are required')
    }

    if (message.length < 20) {
      throw new AppError(400, 'Message must be at least 20 characters')
    }

    // Auto-set priority based on plan
    const userResult = await db.query('SELECT plan FROM users WHERE id = $1', [userId])
    const plan = userResult.rows[0]?.plan || 'free'
    const ticketPriority = plan === 'pro' || plan === 'maker' ? 'high' : (priority || 'normal')

    const result = await db.query(
      `INSERT INTO support_tickets (user_id, site_id, subject, message, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, siteId || null, subject.trim(), message.trim(), ticketPriority]
    )

    const ticket = result.rows[0]

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'ticket_created', req.ip, req.headers['user-agent'] || '', JSON.stringify({ ticket_id: ticket.id, subject })]
    )

    res.status(201).json({
      success: true,
      data: ticket,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const listTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub

    const result = await db.query(
      `SELECT t.*, s.name as site_name
       FROM support_tickets t
       LEFT JOIN sites s ON t.site_id = s.id
       WHERE t.user_id = $1
       ORDER BY t.updated_at DESC`,
      [userId]
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

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const ticketId = req.params.id as string

    const result = await db.query(
      `SELECT t.*, s.name as site_name
       FROM support_tickets t
       LEFT JOIN sites s ON t.site_id = s.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [ticketId, userId]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(404, 'Ticket not found')
    }

    res.json({
      success: true,
      data: result.rows[0],
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const closeTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const ticketId = req.params.id as string

    const existing = await db.query(
      'SELECT id FROM support_tickets WHERE id = $1 AND user_id = $2',
      [ticketId, userId]
    )

    if (!existing.rowCount || existing.rowCount === 0) {
      throw new AppError(404, 'Ticket not found')
    }

    await db.query(
      "UPDATE support_tickets SET status = 'closed', updated_at = NOW() WHERE id = $1",
      [ticketId]
    )

    res.json({
      success: true,
      data: { id: ticketId, status: 'closed' },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}
