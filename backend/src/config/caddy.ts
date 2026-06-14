const CADDY_API = process.env.CADDY_API || 'http://localhost:2019'

export async function getCaddyConfig(): Promise<unknown> {
  return fetch(`${CADDY_API}/config/`).then((r) => r.json())
}

export async function updateCaddyConfig(config: unknown): Promise<void> {
  await fetch(`${CADDY_API}/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  })
}
