import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import crypto from 'crypto'

export const getOverviewAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const days = parseInt(req.query.days as string) || 30

    const sitesResult = await db.query(
      'SELECT id, total_views, total_unique_visitors FROM sites WHERE user_id = $1',
      [userId]
    )
    const sites = sitesResult.rows

    const totalViews = sites.reduce((sum: number, s: any) => sum + (s.total_views || 0), 0)
    const totalUniqueVisitors = sites.reduce((sum: number, s: any) => sum + (s.total_unique_visitors || 0), 0)

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    const chartResult = await db.query(
      `SELECT date, SUM(views) as views, SUM(unique_visitors) as unique_visitors
       FROM analytics_daily
       WHERE site_id IN (SELECT id FROM sites WHERE user_id = $1)
       AND date >= $2
       GROUP BY date
       ORDER BY date ASC`,
      [userId, sinceDate.toISOString().slice(0, 10)]
    )

    const sourcesResult = await db.query(
      `SELECT sources FROM analytics_daily
       WHERE site_id IN (SELECT id FROM sites WHERE user_id = $1)
       AND date >= $2`,
      [userId, sinceDate.toISOString().slice(0, 10)]
    )

    const mergedSources: Record<string, number> = {}
    for (const row of sourcesResult.rows) {
      const sources = row.sources || {}
      for (const [key, val] of Object.entries(sources)) {
        mergedSources[key] = (mergedSources[key] || 0) + (val as number)
      }
    }

    const pagesResult = await db.query(
      `SELECT pages FROM analytics_daily
       WHERE site_id IN (SELECT id FROM sites WHERE user_id = $1)
       AND date >= $2`,
      [userId, sinceDate.toISOString().slice(0, 10)]
    )

    const mergedPages: Record<string, number> = {}
    for (const row of pagesResult.rows) {
      const pages = row.pages || {}
      for (const [key, val] of Object.entries(pages)) {
        mergedPages[key] = (mergedPages[key] || 0) + (val as number)
      }
    }

    const topPages = Object.entries(mergedPages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    res.json({
      success: true,
      data: {
        summary: {
          totalViews,
          totalUniqueVisitors,
          sitesTracked: sites.length
        },
        chart: chartResult.rows.map((r: any) => ({
          date: r.date,
          views: r.views,
          unique_visitors: r.unique_visitors
        })),
        sources: mergedSources,
        topPages
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}

export const getSiteAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub
    const siteId = req.params.siteId as string
    const days = parseInt(req.query.days as string) || 30

    const siteResult = await db.query(
      'SELECT id, name, slug, total_views, total_unique_visitors FROM sites WHERE id = $1 AND user_id = $2',
      [siteId, userId]
    )

    if (!siteResult.rowCount || siteResult.rowCount === 0) {
      throw new AppError(404, 'Site not found')
    }

    const site = siteResult.rows[0]
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    const chartResult = await db.query(
      `SELECT date, views, unique_visitors, sources, pages, devices, browsers, countries
       FROM analytics_daily
       WHERE site_id = $1 AND date >= $2
       ORDER BY date ASC`,
      [siteId, sinceDate.toISOString().slice(0, 10)]
    )

    const mergedSources: Record<string, number> = {}
    const mergedDevices: Record<string, number> = {}
    const mergedBrowsers: Record<string, number> = {}
    const mergedPages: Record<string, number> = {}

    for (const row of chartResult.rows) {
      for (const [k, v] of Object.entries(row.sources || {})) mergedSources[k] = (mergedSources[k] || 0) + (v as number)
      for (const [k, v] of Object.entries(row.devices || {})) mergedDevices[k] = (mergedDevices[k] || 0) + (v as number)
      for (const [k, v] of Object.entries(row.browsers || {})) mergedBrowsers[k] = (mergedBrowsers[k] || 0) + (v as number)
      for (const [k, v] of Object.entries(row.pages || {})) mergedPages[k] = (mergedPages[k] || 0) + (v as number)
    }

    const topPages = Object.entries(mergedPages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    res.json({
      success: true,
      data: {
        site: { id: site.id, name: site.name, slug: site.slug },
        summary: {
          totalViews: site.total_views,
          totalUniqueVisitors: site.total_unique_visitors
        },
        chart: chartResult.rows.map((r: any) => ({
          date: r.date,
          views: r.views,
          unique_visitors: r.unique_visitors
        })),
        sources: mergedSources,
        devices: mergedDevices,
        browsers: mergedBrowsers,
        topPages
      },
      meta: { timestamp: new Date().toISOString(), request_id: crypto.randomUUID() }
    })
  } catch (err) {
    next(err)
  }
}
