import { Router } from 'express'
import { db } from '../config/database'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await db.query('SELECT 1')
    res.json({
      success: true,
      data: {
        status: 'ok',
        version: process.env.npm_package_version || '0.0.1',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: 'health'
      }
    })
  } catch {
    res.status(503).json({
      success: false,
      data: { status: 'error', message: 'Database unreachable' },
      meta: { timestamp: new Date().toISOString(), request_id: 'health' }
    })
  }
})

export default router
