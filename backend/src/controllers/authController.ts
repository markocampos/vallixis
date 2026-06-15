import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { generateToken, hashToken, decrypt } from '../utils/crypto'
import { User } from '@shared/types/database'
import { emailService } from '../services/emailService'

const ACCESS_TOKEN_EXPIRY = '24h'
const ACCESS_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000
const REFRESH_TOKEN_EXPIRY_DAYS = 7
const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
const JWT_SECRET: string = process.env.JWT_SECRET!
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

// In-memory JTI revocation cache: jti -> expiry timestamp
// Spec requires: add JWT jti to revocation list with TTL = token expiry
const revokedJtis = new Map<string, number>()
const cleanRevokedJtis = () => {
  const now = Date.now()
  for (const [jti, exp] of revokedJtis.entries()) {
    if (exp < now) revokedJtis.delete(jti)
  }
}
// Clean every hour
setInterval(cleanRevokedJtis, 60 * 60 * 1000)

export function isJtiRevoked(jti: string): boolean {
  return revokedJtis.has(jti) && revokedJtis.get(jti)! > Date.now()
}

function setTokens(res: Response, user: User, refreshTokenId: string) {
  let email = user.email
  try {
    email = decrypt(user.email)
  } catch {
    // If decryption fails, use as-is (for backward compatibility)
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      email,
      plan: user.plan,
      role: user.role,
      jti: crypto.randomUUID()
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      jti: refreshTokenId
    },
    JWT_SECRET,
    { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` }
  )

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_EXPIRY_MS // 24 hours
  })

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_MS
  })
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rowCount && existing.rowCount > 0) {
      throw new AppError(400, 'Email already registered')
    }

    const password_hash = await bcrypt.hash(password, 12)
    const verification_token = generateToken()
    
    const result = await db.query<User>(
      `INSERT INTO users (email, password_hash, name, email_verification_token)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, password_hash, name, hashToken(verification_token)]
    )

    const user = result.rows[0]
    
    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'register', req.ip, req.headers['user-agent'] || '']
    )

    await emailService.sendVerificationEmail(user.email, verification_token)

    const refreshTokenId = crypto.randomUUID()
    const hashedRefreshTokenId = hashToken(refreshTokenId)
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
    
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [user.id, hashedRefreshTokenId, expiresAt, req.ip, req.headers['user-agent'] || '']
    )

    setTokens(res, user, refreshTokenId)
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const result = await db.query<User>('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      throw new AppError(401, 'Invalid credentials')
    }

    if (!user.email_verified) {
      throw new AppError(403, 'Please verify your email before logging in')
    }

    if (user.locked_until && user.locked_until > new Date()) {
      throw new AppError(401, 'Account locked. Try again later.')
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    
    if (!valid) {
      const attempts = user.failed_login_attempts + 1
      let locked_until = null
      if (attempts >= 5) {
        locked_until = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      }
      await db.query('UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3', [attempts, locked_until, user.id])
      throw new AppError(401, 'Invalid credentials')
    }

    await db.query('UPDATE users SET failed_login_attempts = 0, locked_until = null, last_login = NOW() WHERE id = $1', [user.id])

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'login', req.ip, req.headers['user-agent'] || '']
    )

    const refreshTokenId = crypto.randomUUID()
    const hashedRefreshTokenId = hashToken(refreshTokenId)
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
    
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [user.id, hashedRefreshTokenId, expiresAt, req.ip, req.headers['user-agent'] || '']
    )

    setTokens(res, user, refreshTokenId)

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Revoke refresh token in DB
    const rToken = req.cookies?.refresh_token
    if (rToken) {
      try {
        const payload = jwt.verify(rToken, JWT_SECRET) as any
        const hashedId = hashToken(payload.jti)
        await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1', [hashedId])
      } catch (err) {
        // Ignore token errors on logout
      }
    }

    // Add access token JTI to in-memory revocation list (TTL = token expiry)
    // Spec: "add JWT jti to revocation list (in-memory cache with TTL = token expiry)"
    const aToken = req.cookies?.access_token
    if (aToken) {
      try {
        const payload = jwt.decode(aToken) as any
        if (payload?.jti && payload?.exp) {
          revokedJtis.set(payload.jti, payload.exp * 1000) // exp is in seconds
        }
      } catch (err) {
        // Ignore decode errors
      }
    }
    
    if (req.user) {
      await db.query(
        'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
        [req.user.sub, 'logout', req.ip, req.headers['user-agent'] || '']
      )
    }

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/'
    }
    res.clearCookie('access_token', cookieOpts)
    res.clearCookie('refresh_token', cookieOpts)
    
    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userResult = await db.query<User>('SELECT id, email, name, role, plan FROM users WHERE id = $1', [req.user!.sub])
    const user = userResult.rows[0]
    if (!user) throw new AppError(404, 'User not found')

    let email = user.email
    try {
      email = decrypt(user.email)
    } catch {
      // If decryption fails, use as-is
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

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token
    if (!token) throw new AppError(401, 'No refresh token provided')

    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      throw new AppError(401, 'Invalid refresh token')
    }

    const hashedId = hashToken(payload.jti)
    const tokenRecord = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()', [hashedId])
    
    if (!tokenRecord.rowCount || tokenRecord.rowCount === 0) {
      throw new AppError(401, 'Invalid or revoked refresh token')
    }

    const userResult = await db.query<User>('SELECT * FROM users WHERE id = $1 AND status = $2', [payload.sub, 'active'])
    const user = userResult.rows[0]
    
    if (!user) {
      throw new AppError(401, 'User account is inactive or not found')
    }
    
    await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1', [hashedId])

    const newRefreshTokenId = crypto.randomUUID()
    const newHashedRefreshTokenId = hashToken(newRefreshTokenId)
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
    
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [user.id, newHashedRefreshTokenId, expiresAt, req.ip, req.headers['user-agent'] || '']
    )

    setTokens(res, user, newRefreshTokenId)

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/'
    }
    res.clearCookie('access_token', cookieOpts)
    res.clearCookie('refresh_token', cookieOpts)
    next(err)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body
    if (!token) throw new AppError(400, 'Token is required')

    const hashed = hashToken(token)
    const result = await db.query<User>('SELECT id FROM users WHERE email_verification_token = $1', [hashed])
    
    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(400, 'Invalid or expired token')
    }

    const user = result.rows[0]

    await db.query('UPDATE users SET email_verified = true, email_verification_token = null WHERE id = $1', [user.id])
    
    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'verify_email', req.ip, req.headers['user-agent'] || '']
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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    
    const result = await db.query<User>('SELECT id FROM users WHERE email = $1', [email])
    if (result.rowCount && result.rowCount > 0) {
      const user = result.rows[0]
      const resetToken = generateToken()
      const hashedToken = hashToken(resetToken)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      
      await db.query(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
        [hashedToken, expiresAt, user.id]
      )

      await emailService.sendPasswordResetEmail(email, resetToken)
    }

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body
    const hashedToken = hashToken(token)

    const result = await db.query<User>(
      'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [hashedToken]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(400, 'Invalid or expired password reset token')
    }

    const user = result.rows[0]
    const password_hash = await bcrypt.hash(password, 12)

    await db.query(
      'UPDATE users SET password_hash = $1, password_reset_token = null, password_reset_expires = null WHERE id = $2',
      [password_hash, user.id]
    )

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'reset_password', req.ip, req.headers['user-agent'] || '']
    )

    await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1', [user.id])

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}
