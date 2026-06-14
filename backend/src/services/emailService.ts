import nodemailer from 'nodemailer'
import { logger } from '../utils/logger'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025', 10),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
})

export const emailService = {
  sendVerificationEmail: async (to: string, token: string) => {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`
    
    logger.info(`Sending verification email to ${to} with URL: ${url}`)
    
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@vallixis.io',
        to,
        subject: 'Verify your email address - Vallixis',
        html: `
          <h1>Welcome to Vallixis</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${url}">${url}</a>
        `
      })
    } catch (error) {
      logger.error('Failed to send verification email', error)
      // Do not throw, to avoid failing user registration when SMTP is down
    }
  },
  sendPasswordResetEmail: async (to: string, token: string) => {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
    
    logger.info(`Sending password reset email to ${to} with URL: ${url}`)
    
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@vallixis.io',
        to,
        subject: 'Reset your password - Vallixis',
        html: `
          <h1>Password Reset</h1>
          <p>Please click the link below to reset your password. This link expires in 1 hour.</p>
          <a href="${url}">${url}</a>
        `
      })
    } catch (error) {
      logger.error('Failed to send password reset email', error)
    }
  }
}
