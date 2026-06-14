import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import { requestLogger } from './middleware/requestLogger'
import { securityHeaders } from './middleware/securityHeaders'
import { errorHandler } from './middleware/errorHandler'
import { defaultLimit } from './middleware/rateLimit'

import healthRouter from './routes/health'
import authRouter from './routes/auth'
import sitesRouter from './routes/sites'
import templatesRouter from './routes/templates'
import assetsRouter from './routes/assets'
import billingRouter from './routes/billing'
import analyticsRouter from './routes/analytics'
import supportRouter from './routes/support'
import adminRouter from './routes/admin'

const app = express()

// Trust proxy (for rate limiting behind Caddy/nginx)
app.set('trust proxy', 1)

// Security
app.use(
  helmet({
    contentSecurityPolicy: false // handled by securityHeaders middleware
  })
)
app.use(securityHeaders)

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key']
  })
)

// Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Logging
app.use(requestLogger)

// Rate limiting (default)
app.use('/v1/', defaultLimit)

// Routes
app.use('/v1/health', healthRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/sites', sitesRouter)
app.use('/v1/templates', templatesRouter)
app.use('/v1/assets', assetsRouter)
app.use('/v1/billing', billingRouter)
app.use('/v1/analytics', analyticsRouter)
app.use('/v1/support', supportRouter)
app.use('/v1/admin', adminRouter)

// 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    meta: { timestamp: new Date().toISOString(), request_id: 'not-found' },
    errors: [{ field: 'general', message: 'Route not found' }]
  })
})

// Error handler (must be last)
app.use(errorHandler)

export default app
