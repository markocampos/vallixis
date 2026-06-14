export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (password.length > 128) errors.push('At most 128 characters')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('At least one number')
  return { valid: errors.length === 0, errors }
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{3,50}$/.test(slug)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}
