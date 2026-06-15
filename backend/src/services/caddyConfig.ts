import { updateCaddyConfig } from '../config/caddy'
import { logger } from '../utils/logger'

interface SiteRoute {
  slug: string
  port: number
  domain: string
}

export async function addSiteRoute(site: SiteRoute): Promise<boolean> {
  try {
    const config = {
      apps: {
        http: {
          servers: {
            vallixis: {
              listen: [':443', ':80'],
              routes: [
                {
                  match: [{ host: [site.domain] }],
                  handle: [
                    {
                      handler: 'reverse_proxy',
                      upstreams: [{ dial: `localhost:${site.port}` }],
                      headers: {
                        request: {
                          set: [
                            { name: 'X-Forwarded-Proto', value: '{scheme}' },
                            { name: 'X-Real-IP', value: '{remote_host}' }
                          ]
                        }
                      }
                    }
                  ],
                  terminal: true
                }
              ]
            }
          }
        },
        tls: {
          automation: {
            policies: [{
              subjects: [site.domain],
              issuer: {
                email: 'admin@vallixis.io',
                challenges: { http: { interfaces: [':80'] } }
              }
            }]
          }
        }
      }
    }

    await updateCaddyConfig(config)
    logger.info(`Caddy route added: ${site.domain} -> localhost:${site.port}`)
    return true
  } catch (err) {
    logger.error(`Caddy route failed for ${site.domain}:`, err)
    return false
  }
}

export async function removeSiteRoute(domain: string): Promise<boolean> {
  try {
    const config = {
      apps: {
        http: {
          servers: {
            vallixis: {
              routes: [
                {
                  match: [{ host: [domain] }],
                  handle: [{ handler: 'static_response', status_code: 404 }],
                  terminal: true
                }
              ]
            }
          }
        }
      }
    }

    await updateCaddyConfig(config)
    logger.info(`Caddy route removed: ${domain}`)
    return true
  } catch (err) {
    logger.error(`Caddy remove failed for ${domain}:`, err)
    return false
  }
}

export async function addCatchAllRedirect(fromDomain: string, toDomain: string): Promise<boolean> {
  try {
    const config = {
      apps: {
        http: {
          servers: {
            vallixis: {
              routes: [
                {
                  match: [{ host: [fromDomain] }],
                  handle: [
                    {
                      handler: 'static_response',
                      status_code: 301,
                      headers: {
                        Location: [`https://${toDomain}{http.request.uri}`]
                      }
                    }
                  ],
                  terminal: true
                }
              ]
            }
          }
        }
      }
    }

    await updateCaddyConfig(config)
    return true
  } catch (err) {
    logger.error(`Caddy redirect failed: ${fromDomain} -> ${toDomain}:`, err)
    return false
  }
}
