import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now()
  const requestId = uuidv4()
  req.headers['x-request-id'] = requestId
  res.setHeader('X-Request-Id', requestId)

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
      requestId,
      ip: req.ip
    })
  })

  next()
}
