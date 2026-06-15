import { Router } from 'express'
import { getOverviewAnalytics, getSiteAnalytics } from '../controllers/analyticsController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getOverviewAnalytics)
router.get('/site/:siteId', authenticate, getSiteAnalytics)

export default router
