import { readJobs, writeJobs, lock, unlock, isLocked, QueueJob } from './queue'
import { deploySite, deleteSite } from '../services/deployment'
import { logger } from '../utils/logger'

const PROCESS_INTERVAL = 5000 // 5 seconds
let processing = false

async function processJob(job: QueueJob): Promise<boolean> {
  logger.info(`Processing job: ${job.id} (${job.type}) for site ${job.siteId}`)

  try {
    switch (job.type) {
      case 'deploy':
      case 'update': {
        const result = await deploySite({
          siteId: job.siteId,
          userId: job.userId,
          step: job.payload.step as string,
        })
        return result.success
      }
      case 'delete': {
        return await deleteSite(job.siteId)
      }
      default:
        logger.warn(`Unknown job type: ${job.type}`)
        return false
    }
  } catch (err) {
    logger.error(`Job ${job.id} failed:`, err)
    return false
  }
}

async function processQueue() {
  if (processing || isLocked()) return

  processing = true
  lock()

  try {
    const jobs = readJobs()
    const pending = jobs.filter((j) => j.status === 'pending')

    if (pending.length === 0) {
      processing = false
      unlock()
      return
    }

    // Sort by priority (1 = high first)
    pending.sort((a, b) => a.priority - b.priority)

    for (const job of pending) {
      job.status = 'running'
      job.startedAt = new Date().toISOString()
      job.attempts++
      writeJobs(jobs)

      const success = await processJob(job)

      if (success) {
        job.status = 'completed'
        job.completedAt = new Date().toISOString()
        logger.info(`Job completed: ${job.id}`)
      } else if (job.attempts >= job.maxAttempts) {
        job.status = 'failed'
        job.error = 'Max attempts reached'
        job.completedAt = new Date().toISOString()
        logger.error(`Job failed permanently: ${job.id}`)
      } else {
        job.status = 'pending' // Retry
        job.error = undefined
        logger.warn(`Job ${job.id} will retry (attempt ${job.attempts}/${job.maxAttempts})`)
      }

      writeJobs(jobs)
    }

    // Cleanup completed/failed jobs older than 1 hour
    const cutoff = Date.now() - 3600000
    const cleaned = jobs.filter((j) => {
      if (j.status === 'completed' || j.status === 'failed') {
        return new Date(j.completedAt || j.createdAt).getTime() > cutoff
      }
      return true
    })
    if (cleaned.length < jobs.length) {
      writeJobs(cleaned)
    }
  } catch (err) {
    logger.error('Queue processor error:', err)
  } finally {
    processing = false
    unlock()
  }
}

export function startQueueWorker() {
  logger.info('Queue worker started')
  setInterval(processQueue, PROCESS_INTERVAL)
  // Process immediately on start
  processQueue()
}

export function stopQueueWorker() {
  logger.info('Queue worker stopped')
}
