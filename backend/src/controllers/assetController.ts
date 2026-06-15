import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/vallixis/uploads'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']

function ensureUploadDir(userId: string) {
  const dir = path.join(UPLOAD_DIR, userId)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

function cleanOriginalName(name: string): string {
  // Remove file extension
  const withoutExt = name.replace(/\.[^.]+$/, '')
  // Replace spaces and special chars with hyphens
  return withoutExt
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim() || 'untitled'
}

export const listAssets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { type, sort } = req.query

    let query = 'SELECT * FROM assets WHERE user_id = $1'
    const params: unknown[] = [userId]

    if (type && typeof type === 'string' && type !== 'all') {
      if (type === 'images') {
        query += " AND mime_type LIKE 'image/%'"
      } else if (type === 'documents') {
        query += " AND NOT mime_type LIKE 'image/%'"
      }
    }

    query += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC'

    const result = await db.query(query, params)
    const totalSize = result.rows.reduce((sum: number, a: any) => sum + (a.size_bytes || 0), 0)

    res.json({
      success: true,
      data: { assets: result.rows, total: result.rows.length, totalSize, count: result.rows.length },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) { next(err) }
}

export const uploadAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const file = req.file

    if (!file) throw new AppError(400, 'No file uploaded')
    if (file.size > MAX_FILE_SIZE) throw new AppError(400, 'File too large. Max 10MB')
    if (!ALLOWED_TYPES.includes(file.mimetype)) throw new AppError(400, 'File type not allowed')

    // Check storage limit
    const userResult = await db.query('SELECT plan FROM users WHERE id = $1', [userId])
    const plan = userResult.rows[0]?.plan || 'free'
    const limits: Record<string, number> = { free: 50, founder: 500, starter: 500, maker: 2048, pro: 10240 }
    const currentSize = await db.query('SELECT COALESCE(SUM(size_bytes), 0) as total FROM assets WHERE user_id = $1', [userId])
    const currentMB = parseInt(currentSize.rows[0].total) / (1024 * 1024)
    if (currentMB + file.size / (1024 * 1024) > (limits[plan] || 50)) {
      throw new AppError(403, 'Storage limit reached. Upgrade your plan.')
    }

    const userDir = ensureUploadDir(userId)
    const fileUuid = crypto.randomUUID()
    let filename: string
    let filepath: string
    let mimeType = file.mimetype
    let width: number | null = null
    let height: number | null = null

    // Convert images to webp
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      const webpFilename = `${fileUuid}.webp`
      filepath = path.join(userDir, webpFilename)
      const metadata = await sharp(file.buffer).metadata()
      width = metadata.width || null
      height = metadata.height || null
      await sharp(file.buffer).webp({ quality: 85 }).toFile(filepath)
      filename = webpFilename
      mimeType = 'image/webp'
    } else {
      const ext = file.mimetype === 'image/svg+xml' ? '.svg' : file.mimetype === 'application/pdf' ? '.pdf' : '.bin'
      filename = `${fileUuid}${ext}`
      filepath = path.join(userDir, filename)
      fs.writeFileSync(filepath, file.buffer)
    }

    const result = await db.query(
      `INSERT INTO assets (user_id, filename, original_name, mime_type, size_bytes, width, height, url_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, filename, cleanOriginalName(file.originalname), mimeType, file.size, width, height, `/uploads/${userId}/${filename}`]
    )

    await db.query(
      'INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'asset_uploaded', req.ip, req.headers['user-agent'] || '', JSON.stringify({ filename: file.originalname, size: file.size })]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) { next(err) }
}

export const deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const assetId = req.params.id as string

    const existing = await db.query('SELECT * FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId])
    if (!existing.rowCount || existing.rowCount === 0) throw new AppError(404, 'Asset not found')

    const asset = existing.rows[0]
    const filepath = path.join(UPLOAD_DIR, asset.url_path.replace('/uploads/', ''))
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)

    await db.query('DELETE FROM assets WHERE id = $1', [assetId])

    res.json({ success: true, data: null, meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() } })
  } catch (err) { next(err) }
}

export const getAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const assetId = req.params.id as string
    const result = await db.query('SELECT * FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId])
    if (!result.rowCount || result.rowCount === 0) throw new AppError(404, 'Asset not found')
    res.json({ success: true, data: result.rows[0], meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() } })
  } catch (err) { next(err) }
}
