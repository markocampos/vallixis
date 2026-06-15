import { Router } from 'express'
import multer from 'multer'
import { listAssets, uploadAsset, deleteAsset, getAsset } from '../controllers/assetController'
import { authenticate } from '../middleware/auth'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
})

router.get('/', authenticate, listAssets)
router.post('/', authenticate, upload.single('file'), uploadAsset)
router.get('/:id', authenticate, getAsset)
router.delete('/:id', authenticate, deleteAsset)

export default router
