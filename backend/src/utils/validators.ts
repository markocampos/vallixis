import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const emailSchema = z.string().email('Invalid email address').toLowerCase().trim()

export const uuidSchema = z.string().uuid('Invalid ID')

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(100).trim(),
  turnstileToken: z.string().min(1, 'Security check is required')
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  turnstileToken: z.string().min(1, 'Security check is required')
})

export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema
})
