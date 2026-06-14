import fs from 'fs'
import path from 'path'
import { logger } from '../utils/logger'

export type JobType = 'deploy' | 'update' | 'delete'
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface QueueJob {
  id: string
  type: JobType
  siteId: string
  userId: string
  payload: Record<string, unknown>
  status: JobStatus
  priority: 1 | 2
  attempts: number
  maxAttempts: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  error?: string
}

const QUEUE_DIR = process.env.QUEUE_DIR || '/tmp/vallixis/queue'
const QUEUE_FILE = path.join(QUEUE_DIR, 'jobs.json')
const LOCK_FILE = path.join(QUEUE_DIR, 'jobs.lock')

function ensureDir() {
  if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true })
}

export function readJobs(): QueueJob[] {
  ensureDir()
  if (!fs.existsSync(QUEUE_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8')) as QueueJob[]
  } catch {
    return []
  }
}

export function writeJobs(jobs: QueueJob[]): void {
  ensureDir()
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(jobs, null, 2))
}

export function addJob(job: Omit<QueueJob, 'attempts' | 'maxAttempts' | 'createdAt' | 'status'>): QueueJob {
  const newJob: QueueJob = {
    ...job,
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
    createdAt: new Date().toISOString()
  }
  const jobs = readJobs()
  jobs.push(newJob)
  writeJobs(jobs)
  logger.info(`Job added to queue: ${newJob.id} (${newJob.type})`)
  return newJob
}

export function isLocked(): boolean {
  return fs.existsSync(LOCK_FILE)
}

export function lock(): void {
  fs.writeFileSync(LOCK_FILE, process.pid.toString())
}

export function unlock(): void {
  if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE)
}
