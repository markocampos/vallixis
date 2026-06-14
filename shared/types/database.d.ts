export type UserPlan = 'free' | 'starter' | 'maker' | 'pro'
export type UserStatus = 'active' | 'suspended' | 'cancelled' | 'pending_deletion'
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  password_hash: string
  name: string | null
  plan: UserPlan
  status: UserStatus
  role: UserRole
  email_verified: boolean
  email_verification_token: string | null
  password_reset_token: string | null
  password_reset_expires: Date | null
  created_at: Date
  updated_at: Date
  last_login: Date | null
  paymongo_customer_id: string | null
  paymongo_subscription_id: string | null
  paymongo_payment_method_id: string | null
  founder_pricing_eligible: boolean
  failed_login_attempts: number
  locked_until: Date | null
  reported_count: number
  deletion_scheduled_at: Date | null
  deletion_requested_at: Date | null
}

export type SiteStatus = 'pending' | 'building' | 'live' | 'suspended' | 'error'
export type SiteTemplate = 'business' | 'portfolio' | 'ecommerce'
export type SiteVibe = 'warm' | 'modern' | 'bold' | 'minimal'
export type DomainType = 'duckdns' | 'custom' | 'buy'

export interface Site {
  id: string
  user_id: string
  name: string
  slug: string
  template: SiteTemplate
  vibe: SiteVibe
  description: string | null
  domain: string | null
  domain_type: DomainType
  domain_verified: boolean
  domain_verified_at: Date | null
  port: number | null
  status: SiteStatus
  storage_used_mb: number
  bandwidth_used_mb: number
  last_deployed_at: Date | null
  created_at: Date
  updated_at: Date
  config_json: Record<string, unknown>
  abuse_flags: number
  show_vallixis_branding: boolean
  total_views: number
  total_unique_visitors: number
}

export interface Asset {
  id: string
  site_id: string
  filename: string
  original_name: string
  mime_type: string
  size_bytes: number
  width: number | null
  height: number | null
  url_path: string
  created_at: Date
}

export type DeploymentStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface Deployment {
  id: string
  site_id: string
  status: DeploymentStatus
  step: string | null
  error_message: string | null
  started_at: Date | null
  completed_at: Date | null
  created_at: Date
  logs: string | null
}

export interface Invoice {
  id: string
  user_id: string
  site_id: string | null
  paymongo_payment_intent_id: string | null
  paymongo_subscription_id: string | null
  amount: number
  currency: string
  description: string | null
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  billing_period_start: Date | null
  billing_period_end: Date | null
  receipt_url: string | null
  metadata: Record<string, unknown>
  created_at: Date
  paid_at: Date | null
}
