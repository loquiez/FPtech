import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectVpn, getClientIp, isPrivateIp } from '@/lib/vpn-detect'

const CACHE_COOKIE = '_vpc2'
const CACHE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/vpn-blocked')) {
    return NextResponse.next()
  }

  const cached = request.cookies.get(CACHE_COOKIE)?.value
  if (cached === '1') {
    return NextResponse.redirect(buildUrl('/vpn-blocked/', request))
  }
  if (cached === '0') {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  if (!ip || isPrivateIp(ip)) return NextResponse.next()

  const result = await detectVpn(ip)
  if (!result) {
    return NextResponse.next()
  }

  console.log(`[vpn-check] ip=${ip} blocked=${result.blocked} reason=${result.reason}`)

  const response = result.blocked
    ? NextResponse.redirect(buildUrl('/vpn-blocked/', request))
    : NextResponse.next()

  response.cookies.set(CACHE_COOKIE, result.blocked ? '1' : '0', {
    maxAge: CACHE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return response
}

// Build an absolute URL for redirects using forwarded headers when present.
// Reverse proxies (nginx without `proxy_set_header Host $host`) leak the
// upstream host (localhost:3000) into request.url, breaking absolute redirects.
function buildUrl(path: string, request: NextRequest): URL {
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

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\.[a-zA-Z]{2,}$).*)'],
}
