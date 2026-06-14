import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4()

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: requestId },
      errors: err.issues.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: requestId },
      errors: [{ field: 'general', message: err.message }]
    })
    return
  }

  logger.error('Unhandled error', { err: err.message, stack: err.stack, path: req.path })

  res.status(500).json({
    success: false,
    data: null,
    meta: { timestamp: new Date().toISOString(), request_id: requestId },
    errors: [{ field: 'general', message: 'Internal server error' }]
  })
}
