import { logger } from '../utils/logger'

const DUCKDNS_TOKEN = process.env.DUCKDNS_TOKEN || ''
const DUCKDNS_DOMAIN = process.env.DUCKDNS_DOMAIN || 'vallixis.io'

export async function updateDuckDNS(subdomain: string, ip: string): Promise<boolean> {
  if (!DUCKDNS_TOKEN) {
    logger.warn('DUCKDNS_TOKEN not set, skipping DNS update')
    return false
  }

  const domain = `${subdomain}.${DUCKDNS_DOMAIN}`
  const url = `https://www.duckdns.org/update?domains=${domain}&token=${DUCKDNS_TOKEN}&ip=${ip}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    const ok = text.trim() === 'OK'
    if (ok) {
      logger.info(`DuckDNS updated: ${domain} -> ${ip}`)
    } else {
      logger.error(`DuckDNS failed for ${domain}: ${text}`)
    }
    return ok
  } catch (err) {
    logger.error(`DuckDNS error for ${domain}:`, err)
    return false
  }
}

export async function removeDuckDNS(subdomain: string): Promise<boolean> {
  if (!DUCKDNS_TOKEN) return false

  const domain = `${subdomain}.${DUCKDNS_DOMAIN}`
  const url = `https://www.duckdns.org/update?domains=${domain}&token=${DUCKDNS_TOKEN}&clear=true`

  try {
    const res = await fetch(url)
    const text = await res.text()
    logger.info(`DuckDNS removed: ${domain}`)
    return text.trim() === 'OK'
  } catch (err) {
    logger.error(`DuckDNS remove error for ${domain}:`, err)
    return false
  }
}

export async function getPublicIP(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json() as { ip: string }
    return data.ip
  } catch {
    return null
  }
}
