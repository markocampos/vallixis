import 'dotenv/config'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://vallixis:vallixis@localhost:5432/vallixis' })

async function seedAdmin() {
  const client = await pool.connect()
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@vallixis.io'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'))

    await client.query(
      `INSERT INTO users (email, password_hash, name, plan, role, email_verified, status)
       VALUES ($1, $2, 'Admin', 'pro', 'admin', TRUE, 'active')
       ON CONFLICT (email) DO UPDATE SET role = 'admin', password_hash = $2`,
      [email, passwordHash]
    )

    console.log(`✓ Admin user seeded: ${email}`)
  } catch (err) {
    console.error('Failed to seed admin:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seedAdmin()
