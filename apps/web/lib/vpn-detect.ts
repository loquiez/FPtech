import type { NextRequest } from 'next/server'

const FETCH_TIMEOUT_MS = 3500

const VPN_KEYWORDS = [
  'vpn', 'proxy', 'tor exit', 'mullvad', 'nordvpn', 'expressvpn', 'protonvpn',
  'surfshark', 'cyberghost', 'ipvanish', 'windscribe', 'private internet access',
  'hidemyass', 'hotspot shield', 'tunnelbear', 'astrill', 'vyprvpn', 'hide.me',
  'pia ', 'datapacket', 'm247', 'datacamp', 'frantech', 'packethub', 'quadranet',
  'psychz', 'tzulo', 'leaseweb', 'serverius', 'choopa', 'vultr', 'privado',
  'anonine', 'hosting', 'datacenter', 'data center', 'colocation', 'amazon',
  'google cloud', 'digitalocean', 'linode', 'ovh', 'hetzner',
]

export interface DetectionResult {
  blocked: boolean
  reason: string
  details?: Record<string, unknown>
}

export async function detectVpn(ip: string): Promise<DetectionResult | null> {
  try {
    const res = await fetch(`https://api.ipapi.is/?q=${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'pharmapi-middleware/1.0' },
    })
    if (!res.ok) {
      console.error(`[vpn-check] ipapi.is non-200: ${res.status}`)
      return null
    }
    const data = await res.json()

    if (data.is_vpn === true) return { blocked: true, reason: 'vpn-flag', details: data }
    if (data.is_proxy === true) return { blocked: true, reason: 'proxy-flag', details: data }
    if (data.is_tor === true) return { blocked: true, reason: 'tor-flag', details: data }

    const companyType = String(data.company?.type ?? '').toLowerCase()
    const asnType = String(data.asn?.type ?? '').toLowerCase()
    if (data.is_datacenter === true || companyType === 'hosting' || asnType === 'hosting') {
      return { blocked: true, reason: 'datacenter', details: data }
    }

    const text = [
      data.company?.name, data.company?.domain,
      data.asn?.org, data.asn?.descr, data.asn?.domain,
    ].filter(Boolean).join(' ').toLowerCase()

    const matched = VPN_KEYWORDS.find(kw => text.includes(kw))
    if (matched) return { blocked: true, reason: `keyword:${matched}`, details: data }

    return { blocked: false, reason: 'clean', details: data }
  } catch (err) {
    console.error('[vpn-check] ipapi.is fetch failed:', err instanceof Error ? err.message : err)
    return null
  }
}

export function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return null
}

export function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  )
}
