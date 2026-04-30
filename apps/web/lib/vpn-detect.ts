import type { NextRequest } from 'next/server'

const FETCH_TIMEOUT_MS = 3500
const HIGH_RISK_QUALIFIERS = new Set(['High', 'Very High', 'Critical'])

// Last-resort keyword list — only matches known VPN/proxy brands the structured
// ipapi.is signals occasionally miss. Generic terms like "amazon"/"hosting" are
// intentionally excluded; those are caught by is_datacenter / company.type.
const VPN_KEYWORDS = [
  'mullvad', 'nordvpn', 'expressvpn', 'protonvpn', 'surfshark', 'cyberghost',
  'ipvanish', 'windscribe', 'private internet access', 'hidemyass', 'pia ',
  'hotspot shield', 'tunnelbear', 'astrill', 'vyprvpn', 'hide.me',
  'vpn unlimited', 'browsec', 'urban vpn', 'tuxler', 'turbo vpn',
  'm247', 'datacamp', 'frantech', 'packethub', 'quadranet', 'psychz', 'tzulo',
]

export interface DetectionResult {
  blocked: boolean
  reason: string
  details?: Record<string, unknown>
}

function parseAbuserScore(s: unknown): { score: number; qualifier: string } | null {
  if (typeof s !== 'string') return null
  const m = /^([\d.]+)\s*\(([^)]+)\)/.exec(s.trim())
  if (!m) return null
  return { score: parseFloat(m[1]!), qualifier: m[2]!.trim() }
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

    // Mobile carrier IPs — always allow. Mobile VPN apps change the apparent IP
    // to the VPN exit (which lands in another bucket), not the carrier IP.
    if (data.is_mobile === true) {
      return { blocked: false, reason: 'mobile', details: data }
    }

    // Direct flags from ipapi.is — highest confidence.
    if (data.is_vpn === true) return { blocked: true, reason: 'vpn-flag', details: data }
    if (data.is_proxy === true) return { blocked: true, reason: 'proxy-flag', details: data }
    if (data.is_tor === true) return { blocked: true, reason: 'tor-flag', details: data }
    if (data.is_abuser === true) return { blocked: true, reason: 'abuser-flag', details: data }

    // Datacenter / hosting classification — covers most uncategorized VPN exits.
    const companyType = String(data.company?.type ?? '').toLowerCase()
    const asnType = String(data.asn?.type ?? '').toLowerCase()
    if (data.is_datacenter === true || companyType === 'hosting' || asnType === 'hosting') {
      return { blocked: true, reason: 'datacenter', details: data }
    }

    // Reputation scores — qualifier-based to avoid arbitrary float thresholds.
    const companyScore = parseAbuserScore(data.company?.abuser_score)
    if (companyScore && HIGH_RISK_QUALIFIERS.has(companyScore.qualifier)) {
      return { blocked: true, reason: `company-abuse:${companyScore.qualifier}`, details: data }
    }
    const asnScore = parseAbuserScore(data.asn?.abuser_score)
    if (asnScore && HIGH_RISK_QUALIFIERS.has(asnScore.qualifier)) {
      return { blocked: true, reason: `asn-abuse:${asnScore.qualifier}`, details: data }
    }

    // Last-resort: well-known VPN brand names in company/ASN strings.
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

// Build an absolute URL for redirects. Reverse proxies (nginx without
// `proxy_set_header Host $host`) leak the upstream host (localhost:3000) into
// request.url, breaking redirects. Prefer x-forwarded-host / Host (when not
// localhost), then SITE_URL env, then fall back to request.url.
export function buildUrl(path: string, request: NextRequest): URL {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const host = forwardedHost ?? request.headers.get('host')
  if (host && !host.startsWith('localhost') && !host.startsWith('127.')) {
    const proto = forwardedProto ?? 'https'
    return new URL(path, `${proto}://${host}`)
  }
  const siteUrl = process.env.SITE_URL
  if (siteUrl) return new URL(path, siteUrl)
  return new URL(path, request.url)
}
