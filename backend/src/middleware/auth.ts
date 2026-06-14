import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'
import { UserRole, UserPlan } from '@shared/types/database'
import { isJtiRevoked } from '../controllers/authController'

export interface JwtPayload {
  sub: string
  email: string
  plan: UserPlan
  role: UserRole
  iat: number
  exp: number
  jti: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token
  if (!token) throw new AppError(401, 'Authentication required')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    // Check in-memory JTI revocation list (populated on logout)
    if (payload.jti && isJtiRevoked(payload.jti)) {
      throw new AppError(401, 'Token has been revoked')
    }
    req.user = payload
    next()
  } catch {
    throw new AppError(401, 'Invalid or expired token')
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) throw new AppError(401, 'Authentication required')
  if (req.user.role !== 'admin') throw new AppError(403, 'Admin access required')
  next()
}
