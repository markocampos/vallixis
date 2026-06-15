import { Router } from 'express'
import { getBillingInfo, getFounderStatus, getInvoices } from '../controllers/billingController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getBillingInfo)
router.get('/invoices', authenticate, getInvoices)
router.get('/founder-status', getFounderStatus)

export default router
