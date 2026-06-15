import { Router } from 'express'
import { z } from 'zod'
import { getProfile, updateProfile, changePassword, requestDeletion, cancelDeletion, exportData } from '../controllers/settingsController'
import { authenticate } from '../middleware/auth'
import { validateBody } from '../middleware/validateRequest'

const router = Router()

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).trim()
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
})

const deletionSchema = z.object({
  confirmation: z.literal('DELETE')
})

router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, validateBody(updateProfileSchema), updateProfile)
router.put('/password', authenticate, validateBody(changePasswordSchema), changePassword)
router.post('/export', authenticate, exportData)
router.post('/delete', authenticate, validateBody(deletionSchema), requestDeletion)
router.post('/cancel-deletion', authenticate, cancelDeletion)

export default router
