import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { slugify } from '../utils/slugify'
import { addJob } from '../core/queue'
import { logger } from '../utils/logger'
import crypto from 'crypto'

export const createSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { businessName, description, vibe, template, domainSlug, logo } = req.body

    if (!businessName || !vibe || !template || !domainSlug) {
      throw new AppError(400, 'Missing required fields: businessName, vibe, template, domainSlug')
    }

    const slug = slugify(domainSlug)
    if (!/^[a-z0-9-]{3,50}$/.test(slug)) {
      throw new AppError(400, 'Invalid slug. Use 3-50 lowercase letters, numbers, and hyphens.')
    }

    // Check slug uniqueness
    const existing = await db.query('SELECT id FROM sites WHERE slug = $1', [slug])
    if (existing.rowCount && existing.rowCount > 0) {
      throw new AppError(409, 'This subdomain is already taken. Please choose another.')
    }

    // Check user plan limits
    const userResult = await db.query('SELECT plan FROM users WHERE id = $1', [userId])
    const user = userResult.rows[0]
    if (!user) throw new AppError(404, 'User not found')

    const siteCount = await db.query('SELECT COUNT(*) as count FROM sites WHERE user_id = $1', [userId])
    const limits: Record<string, number> = { free: 1, starter: 1, maker: 3, pro: 10 }
    const maxSites = limits[user.plan] || 1
    if (parseInt(siteCount.rows[0].count) >= maxSites) {
      throw new AppError(403, `You've reached the site limit for the ${user.plan} plan. Upgrade to create more sites.`)
    }

    // Assign a port for the site
    const portResult = await db.query('SELECT MAX(port) as max_port FROM sites')
    const maxPort = portResult.rows[0]?.max_port || 3001
    const port = maxPort + 1

    const domain = `${slug}.vallixis.io`

    const result = await db.query(
      `INSERT INTO sites (user_id, name, slug, template, vibe, description, domain, domain_type, port, status, config_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'duckdns', $8, 'pending', $9)
       RETURNING *`,
      [
        userId,
        businessName.trim(),
        slug,
        template,
        vibe,
        description?.trim() || null,
        domain,
        port,
        JSON.stringify({
          businessName: businessName.trim(),
          description: description?.trim() || '',
          vibe,
          template,
          domain,
          logo: logo || null
        })
      ]
    )

    const site = result.rows[0]

    // Add deployment job
    addJob({
      id: crypto.randomUUID(),
      type: 'deploy',
      siteId: site.id,
      userId,
      payload: { siteId: site.id, step: 'start' },
      priority: user.plan === 'free' ? 2 : 1
    })

    // Audit log
    await db.query(
      'INSERT INTO audit_logs (user_id, site_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [userId, site.id, 'site_created', req.ip, req.headers['user-agent'] || '']
    )

    logger.info(`Site created: ${site.id} (${slug}) by user ${userId}`)

    res.status(201).json({
      success: true,
      data: {
        id: site.id,
        name: site.name,
        slug: site.slug,
        domain: site.domain,
        template: site.template,
        vibe: site.vibe,
        status: site.status,
        created_at: site.created_at
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const listSites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const status = typeof req.query.status === 'string' ? req.query.status : undefined

    let query = 'SELECT id, name, slug, domain, template, vibe, status, storage_used_mb, bandwidth_used_mb, last_deployed_at, created_at, total_views FROM sites WHERE user_id = $1'
    const params: unknown[] = [userId]

    if (status) {
      query += ' AND status = $2'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC'

    const result = await db.query(query, params)

    res.json({
      success: true,
      data: result.rows,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const { id } = req.params

    const result = await db.query(
      'SELECT * FROM sites WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    res.json({
      success: true,
      data: result.rows[0],
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const updateSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const id = req.params.id as string
    const { name, description, config_json } = req.body

    const existing = await db.query('SELECT id FROM sites WHERE id = $1 AND user_id = $2', [id, userId])
    if (!existing.rowCount || existing.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name.trim())
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description?.trim() || null)
    }
    if (config_json !== undefined) {
      updates.push(`config_json = $${paramIndex++}`)
      values.push(JSON.stringify(config_json))
    }

    if (updates.length === 0) {
      throw new AppError(400, 'No fields to update')
    }

    updates.push(`updated_at = NOW()`)
    values.push(id, userId)

    await db.query(
      `UPDATE sites SET ${updates.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex}`,
      values
    )

    // Queue re-deployment
    addJob({
      id: crypto.randomUUID(),
      type: 'update',
      siteId: id,
      userId,
      payload: { siteId: id },
      priority: 1
    })

    res.json({
      success: true,
      data: { id, updated: true },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const deleteSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const id = req.params.id as string

    const existing = await db.query('SELECT id, name FROM sites WHERE id = $1 AND user_id = $2', [id, userId])
    if (!existing.rowCount || existing.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    await db.query('DELETE FROM sites WHERE id = $1 AND user_id = $2', [id, userId])

    await db.query(
      'INSERT INTO audit_logs (user_id, site_id, action, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [userId, id, 'site_deleted', req.ip, req.headers['user-agent'] || '']
    )

    logger.info(`Site deleted: ${id} by user ${userId}`)

    res.json({
      success: true,
      data: null,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getSiteBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const result = await db.query(
      `SELECT s.*, u.name as owner_name
       FROM sites s
       JOIN users u ON s.user_id = u.id
       WHERE s.slug = $1`,
      [slug]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    const site = result.rows[0]

    res.json({
      success: true,
      data: site,
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) { next(err) }
}

export const previewSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const result = await db.query(
      `SELECT s.*, u.name as owner_name
       FROM sites s
       JOIN users u ON s.user_id = u.id
       WHERE s.slug = $1`,
      [slug]
    )

    if (!result.rowCount || result.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    const site = result.rows[0]
    const { renderSite } = await import('../services/templateEngine')

    const config = {
      ...(site.config_json || {}),
      businessName: site.name,
      description: site.description || '',
      vibe: site.vibe || 'modern',
      template: site.template || 'business',
      domain: site.domain,
    }

    const html = renderSite(config)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (err) { next(err) }
}

export const deploySite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const id = req.params.id as string

    const existing = await db.query('SELECT id, status FROM sites WHERE id = $1 AND user_id = $2', [id, userId])
    if (!existing.rowCount || existing.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    if (existing.rows[0].status === 'building') {
      throw new AppError(409, 'Site is already being built')
    }

    await db.query('UPDATE sites SET status = $1 WHERE id = $2', ['building', id])

    addJob({
      id: crypto.randomUUID(),
      type: 'deploy',
      siteId: id,
      userId,
      payload: { siteId: id, step: 'start' },
      priority: 1
    })

    res.json({
      success: true,
      data: { id, status: 'building' },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}
