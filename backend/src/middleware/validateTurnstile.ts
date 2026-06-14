import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'
import { db } from '../config/database'
import { logger } from '../utils/logger'

export async function validateTurnstile(req: Request, res: Response, next: NextFunction) {
  const { turnstileToken, email } = req.body

  if (!turnstileToken) {
    return next(new AppError(400, 'Turnstile token is required'))
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: req.ip
      })
    })

    const data = await response.json() as { success: boolean; 'error-codes'?: string[] }

    if (!data.success) {
      logger.warn(`Turnstile validation failed: ${JSON.stringify(data['error-codes'])}`)
      
      // Attempt to log bot to audit_logs if email was provided
      if (email) {
        const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email])
        if (userRes.rowCount && userRes.rowCount > 0) {
          await db.query(
            'INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5)',
            [userRes.rows[0].id, 'bot_attempt', req.ip, req.headers['user-agent'] || '', JSON.stringify(data)]
          )
        }
      }

      return next(new AppError(400, 'Security check failed. Please try again.'))
    }

    next()
  } catch (error) {
    logger.error('Turnstile verification error:', error)
    return next(new AppError(500, 'Error verifying security check'))
  }
}
