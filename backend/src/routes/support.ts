import { Router } from 'express'
import { z } from 'zod'
import { createTicket, listTickets, getTicket, closeTicket } from '../controllers/supportController'
import { authenticate } from '../middleware/auth'
import { validateBody } from '../middleware/validateRequest'

const router = Router()

const createTicketSchema = z.object({
  subject: z.string().min(3).max(255).trim(),
  message: z.string().min(20).max(5000).trim(),
  siteId: z.string().uuid().nullable().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional()
})

router.post('/', authenticate, validateBody(createTicketSchema), createTicket)
router.get('/', authenticate, listTickets)
router.get('/:id', authenticate, getTicket)
router.post('/:id/close', authenticate, closeTicket)

export default router
