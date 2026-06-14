import 'dotenv/config'
import app from './app'
import { connectDB } from './config/database'
import { logger } from './utils/logger'

const PORT = parseInt(process.env.PORT || '3000')

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      logger.info(`Vallixis API running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Health check: http://localhost:${PORT}/v1/health`)
    })
  } catch (err) {
    logger.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
