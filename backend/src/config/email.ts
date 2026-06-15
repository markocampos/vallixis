// Email configuration is handled in services/emailService.ts
// This file is kept for backward compatibility

export const FROM_EMAIL = process.env.SMTP_FROM || 'hello@vallixis.io'
