import { Router } from 'express'
import { z } from 'zod'
import { createSite, listSites, getSite, updateSite, deleteSite, deploySite, getSiteBySlug, previewSite } from '../controllers/siteController'
import { authenticate } from '../middleware/auth'
import { validateBody } from '../middleware/validateRequest'

const router = Router()

const createSiteSchema = z.object({
  businessName: z.string().min(2).max(100).trim(),
  description: z.string().max(500).trim().nullable().optional(),
  vibe: z.enum(['warm', 'modern', 'bold', 'minimal']),
  template: z.enum(['business', 'portfolio', 'ecommerce']),
  domainSlug: z.string().min(3).max(50).trim(),
  logo: z.string().nullable().optional()
})

const updateSiteSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(500).trim().optional(),
  config_json: z.record(z.string(), z.unknown()).optional()
})

// Public routes
router.get('/preview/:slug', getSiteBySlug)
router.get('/view/:slug', previewSite)

// Authenticated routes
router.post('/', authenticate, validateBody(createSiteSchema), createSite)
router.get('/', authenticate, listSites)
router.get('/:id', authenticate, getSite)
router.put('/:id', authenticate, validateBody(updateSiteSchema), updateSite)
router.delete('/:id', authenticate, deleteSite)
router.post('/:id/deploy', authenticate, deploySite)

export default router
