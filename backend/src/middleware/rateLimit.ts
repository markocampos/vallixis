import rateLimit from 'express-rate-limit'

const makeLimit = (max: number, windowMinutes: number) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
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
