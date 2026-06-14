export type { User, Site, Asset, Deployment, Invoice, UserPlan, UserRole, SiteStatus, SiteTemplate, SiteVibe } from '../../../shared/types/database'
export type { ApiResponse, PaginatedResponse } from '../../../shared/types/api'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  plan: string
  role: string
}

export interface WizardData {
  businessName: string
  description: string
  vibe: string
  template: string
  domainSlug: string
  logo: string | null
}
