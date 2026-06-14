import { Router } from 'express'
import { z } from 'zod'
import { register, login, logout, me, refresh, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController'
import { validateBody } from '../middleware/validateRequest'
import { validateTurnstile } from '../middleware/validateTurnstile'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validators'
import { authenticate } from '../middleware/auth'
import { registerLimit, loginLimit, forgotPasswordLimit } from '../middleware/rateLimit'

const router = Router()

router.post('/register', registerLimit, validateBody(registerSchema), validateTurnstile, register)
router.post('/login', loginLimit, validateBody(loginSchema), validateTurnstile, login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.post('/verify-email', validateBody(z.object({ token: z.string() })), verifyEmail)
router.post('/forgot-password', forgotPasswordLimit, validateBody(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword)
router.get('/me', authenticate, me)

export default router
