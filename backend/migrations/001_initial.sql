-- Vallixis Initial Migration
-- Run once on a fresh PostgreSQL 15 database

BEGIN;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'maker', 'pro')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'pending_deletion')),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP,
  paymongo_customer_id VARCHAR(255),
  paymongo_subscription_id VARCHAR(255),
  paymongo_payment_method_id VARCHAR(255),
  founder_pricing_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP,
  reported_count INTEGER NOT NULL DEFAULT 0,
  deletion_scheduled_at TIMESTAMP,
  deletion_requested_at TIMESTAMP
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  template VARCHAR(50) NOT NULL CHECK (template IN ('business', 'portfolio', 'ecommerce')),
  vibe VARCHAR(20) NOT NULL CHECK (vibe IN ('warm', 'modern', 'bold', 'minimal')),
  description TEXT,
  domain VARCHAR(255),
  domain_type VARCHAR(20) NOT NULL DEFAULT 'duckdns' CHECK (domain_type IN ('duckdns', 'custom', 'buy')),
  domain_verified BOOLEAN NOT NULL DEFAULT FALSE,
  domain_verified_at TIMESTAMP,
  port INTEGER UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'live', 'suspended', 'error')),
  storage_used_mb INTEGER NOT NULL DEFAULT 0,
  bandwidth_used_mb INTEGER NOT NULL DEFAULT 0,
  last_deployed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  config_json JSONB NOT NULL DEFAULT '{}',
  abuse_flags INTEGER NOT NULL DEFAULT 0,
  abuse_last_checked TIMESTAMP,
  show_vallixis_branding BOOLEAN NOT NULL DEFAULT TRUE,
  total_views INTEGER NOT NULL DEFAULT 0,
  total_unique_visitors INTEGER NOT NULL DEFAULT 0
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  step VARCHAR(50),
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  logs TEXT
);

-- Abuse reports table
CREATE TABLE IF NOT EXISTS abuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  reporter_email VARCHAR(255),
  reporter_ip INET,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'false_report')),
  reviewed_by UUID REFERENCES users(id),
  resolution TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  site_id UUID REFERENCES sites(id),
  action VARCHAR(100) NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- PayMongo webhook events table
CREATE TABLE IF NOT EXISTS paymongo_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  paymongo_payment_intent_id VARCHAR(255),
  paymongo_subscription_id VARCHAR(255),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'PHP',
  description VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  billing_period_start TIMESTAMP,
  billing_period_end TIMESTAMP,
  receipt_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMP
);

-- Analytics daily table
CREATE TABLE IF NOT EXISTS analytics_daily (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  avg_time_on_site INTEGER,
  sources JSONB DEFAULT '{}',
  pages JSONB DEFAULT '{}',
  devices JSONB DEFAULT '{}',
  browsers JSONB DEFAULT '{}',
  countries JSONB DEFAULT '{}',
  PRIMARY KEY (site_id, date)
);

-- Domain checks table
CREATE TABLE IF NOT EXISTS domain_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  check_type VARCHAR(20) NOT NULL CHECK (check_type IN ('dns', 'ssl', 'http')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'propagating', 'verified', 'failed')),
  details TEXT,
  checked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMP
);

-- Founder pricing table
CREATE TABLE IF NOT EXISTS founder_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_seats INTEGER NOT NULL DEFAULT 20,
  seats_claimed INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_you', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_domain ON sites(domain);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_assets_site_id ON assets(site_id);
CREATE INDEX IF NOT EXISTS idx_deployments_site_id ON deployments(site_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_site_id ON abuse_reports(site_id);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON abuse_reports(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_paymongo_pi ON invoices(paymongo_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_domain_checks_site ON domain_checks(site_id, check_type);
CREATE INDEX IF NOT EXISTS idx_paymongo_events_id ON paymongo_webhook_events(event_id);

-- Seed founder pricing
INSERT INTO founder_pricing (total_seats, seats_claimed, is_active)
VALUES (20, 0, TRUE)
ON CONFLICT DO NOTHING;

COMMIT;
