import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CACHE_COOKIE = '_vpc'
const CACHE_MAX_AGE = 60 * 60 * 24 // 24 hours

// Known VPN/proxy/datacenter keywords in ISP/org/AS fields
const VPN_KEYWORDS = [
  'vpn', 'proxy', 'tor node', 'mullvad', 'nordvpn', 'expressvpn', 'protonvpn',
  'surfshark', 'cyberghost', 'ipvanish', 'windscribe', 'private internet access',
  'hidemyass', 'hotspot shield', 'tunnelbear', 'astrill', 'vyprvpn', 'hide.me',
  'm247', 'datacamp', 'frantech', 'packethub', 'quadranet', 'psychz', 'tzulo',
  'leaseweb', 'serverius', 'choopa', 'vultr', 'privado', 'anonine',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/vpn-blocked')) {
    return NextResponse.next()
  }

  const cached = request.cookies.get(CACHE_COOKIE)?.value
  if (cached === '1') {
    return NextResponse.redirect(new URL('/vpn-blocked/', request.url))
  }
  if (cached === '0') {
    return NextResponse.next()
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (isPrivateIp(ip)) return NextResponse.next()

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=countryCode,isp,org,as`,
      { signal: AbortSignal.timeout(3000) },
    )
    const data = await res.json()

    const isRussia = data.countryCode === 'RU'
    const isVpn = looksLikeVpn(data.isp, data.org, data.as)
    const blocked = isRussia && isVpn

    const response = blocked
      ? NextResponse.redirect(new URL('/vpn-blocked/', request.url))
      : NextResponse.next()

    response.cookies.set(CACHE_COOKIE, blocked ? '1' : '0', {
      maxAge: CACHE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch {
    return NextResponse.next()
  }
}

function looksLikeVpn(isp = '', org = '', as_ = ''): boolean {
  const text = `${isp} ${org} ${as_}`.toLowerCase()
  return VPN_KEYWORDS.some(kw => text.includes(kw))
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  )
}

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\.[a-zA-Z]{2,}$).*)'],
}
