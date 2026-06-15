import rateLimit from 'express-rate-limit'

const isDev = process.env.NODE_ENV !== 'production'

const makeLimit = (max: number, windowMinutes: number) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: isDev ? max * 10 : max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for localhost in development
      if (isDev) {
        const ip = req.ip || req.socket.remoteAddress || ''
        if (ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('::ffff:127.0.0.1')) {
          return true
        }
      }
      return false
    },
    message: {
      success: false,
      data: null,
      errors: [{ field: 'general', message: 'Too many requests. Please try again later.' }]
    }
  })

export const registerLimit = makeLimit(5, 60)
export const loginLimit = makeLimit(10, 60)
export const forgotPasswordLimit = makeLimit(3, 60)
export const abuseReportLimit = makeLimit(5, 60)
export const defaultLimit = makeLimit(100, 60)
