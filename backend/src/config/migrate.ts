import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://vallixis:vallixis@localhost:5432/vallixis' })

async function migrate() {
  const client = await pool.connect()
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../../migrations/001_initial.sql'), 'utf-8')
    await client.query(sql)
    console.log('Migration 001_initial.sql completed successfully')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
