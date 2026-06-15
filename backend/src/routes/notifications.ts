import { Router } from 'express'
import { getNotifications, getUnreadCount } from '../controllers/notificationController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, getNotifications)
router.get('/unread-count', authenticate, getUnreadCount)

export default router
