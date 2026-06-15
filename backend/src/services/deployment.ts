import fs from 'fs'
import path from 'path'
import { db } from '../config/database'
import { renderSiteFiles } from './templateEngine'
import { addSiteRoute, removeSiteRoute } from './caddyConfig'
import { updateDuckDNS, removeDuckDNS, getPublicIP } from './duckdns'
import { logger } from '../utils/logger'

const SITES_DIR = process.env.SITES_DIR || '/var/www/vallixis/sites'

interface DeployJob {
  siteId: string
  userId: string
  step?: string
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function getSiteConfig(siteId: string) {
  const result = await db.query(
    'SELECT id, name, slug, template, vibe, description, domain, port, config_json, status FROM sites WHERE id = $1',
    [siteId]
  )
  if (!result.rowCount || result.rowCount === 0) {
    throw new Error(`Site not found: ${siteId}`)
  }
  return result.rows[0]
}

async function buildSite(siteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const site = await getSiteConfig(siteId)
    const config = {
      ...(site.config_json || {}),
      businessName: site.name,
      description: site.description || '',
      vibe: site.vibe || 'modern',
      template: site.template || 'business',
      domain: site.domain,
    }

    // Render site files
    const { html, css, js } = renderSiteFiles(config)

    // Create site directory
    const siteDir = path.join(SITES_DIR, site.slug)
    ensureDir(siteDir)

    // Write files
    fs.writeFileSync(path.join(siteDir, 'index.html'), html)
    if (css) fs.writeFileSync(path.join(siteDir, 'styles.css'), css)
    if (js) fs.writeFileSync(path.join(siteDir, 'script.js'), js)

    logger.info(`Site built: ${site.slug} (${siteId})`)
    return { success: true }
  } catch (err: any) {
    logger.error(`Build failed for ${siteId}:`, err)
    return { success: false, error: err.message }
  }
}

async function configureRouting(siteId: string): Promise<boolean> {
  try {
    const site = await getSiteConfig(siteId)
    const ip = await getPublicIP()
    if (!ip) {
      logger.error('Could not get public IP')
      return false
    }

    // Update DuckDNS
    const dnsOk = await updateDuckDNS(site.slug, ip)
    if (!dnsOk) {
      logger.warn(`DNS update failed for ${site.slug}, continuing with Caddy`)
    }

    // Add Caddy route
    const caddyOk = await addSiteRoute({
      slug: site.slug,
      port: site.port,
      domain: site.domain,
    })

    return caddyOk
  } catch (err) {
    logger.error(`Routing config failed for ${siteId}:`, err)
    return false
  }
}

async function updateSiteStatus(siteId: string, status: string, extra?: Record<string, any>) {
  const updates = ['status = $1', 'updated_at = NOW()']
  const values: unknown[] = [status]
  let paramIndex = 2

  if (status === 'live') {
    updates.push(`last_deployed_at = NOW()`)
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      updates.push(`${key} = $${paramIndex++}`)
      values.push(value)
    }
  }
  values.push(siteId)

  await db.query(
    `UPDATE sites SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  )
}

export async function deploySite(job: DeployJob): Promise<{ success: boolean; error?: string }> {
  const { siteId } = job

  try {
    // Mark as building
    await updateSiteStatus(siteId, 'building')

    // Step 1: Build site files
    const buildResult = await buildSite(siteId)
    if (!buildResult.success) {
      await updateSiteStatus(siteId, 'error')
      return buildResult
    }

    // Step 2: Configure routing (Caddy + DNS)
    const routingOk = await configureRouting(siteId)
    if (!routingOk) {
      await updateSiteStatus(siteId, 'error')
      return { success: false, error: 'Routing configuration failed' }
    }

    // Step 3: Mark as live
    await updateSiteStatus(siteId, 'live')

    logger.info(`Site deployed successfully: ${siteId}`)
    return { success: true }
  } catch (err: any) {
    logger.error(`Deployment failed for ${siteId}:`, err)
    await updateSiteStatus(siteId, 'error')
    return { success: false, error: err.message }
  }
}

export async function redeploySite(siteId: string): Promise<{ success: boolean; error?: string }> {
  return deploySite({ siteId, userId: '', step: 'start' })
}

export async function deleteSite(siteId: string): Promise<boolean> {
  try {
    const site = await getSiteConfig(siteId)

    // Remove Caddy route
    await removeSiteRoute(site.domain)

    // Remove DNS
    await removeDuckDNS(site.slug)

    // Remove files
    const siteDir = path.join(SITES_DIR, site.slug)
    if (fs.existsSync(siteDir)) {
      fs.rmSync(siteDir, { recursive: true, force: true })
    }

    logger.info(`Site deleted: ${site.slug} (${siteId})`)
    return true
  } catch (err) {
    logger.error(`Delete failed for ${siteId}:`, err)
    return false
  }
}

export async function getSiteUrl(siteId: string): Promise<string | null> {
  try {
    const site = await getSiteConfig(siteId)
    return `https://${site.domain}`
  } catch {
    return null
  }
}
