import { Pool } from 'pg'
import { logger } from '../utils/logger'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', err)
})

export const db = {
  query: <T extends import('pg').QueryResultRow = any>(text: string, params?: unknown[]) =>
    pool.query<T>(text, params),
  getClient: () => pool.connect()
}

export async function connectDB(): Promise<void> {
  const client = await pool.connect()
  client.release()
  logger.info('PostgreSQL connected')
}

export default pool
