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
    return NextResponse.redirect(new URL('/vpn-blocked/', request.url))
  }
  if (cached === '0') {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  if (!ip || isPrivateIp(ip)) return NextResponse.next()

  const result = await detectVpn(ip)
  if (!result) {
    // API failure — fail open, no caching, retry on next request
    return NextResponse.next()
  }

  console.log(`[vpn-check] ip=${ip} blocked=${result.blocked} reason=${result.reason}`)

  const response = result.blocked
    ? NextResponse.redirect(new URL('/vpn-blocked/', request.url))
    : NextResponse.next()

  response.cookies.set(CACHE_COOKIE, result.blocked ? '1' : '0', {
    maxAge: CACHE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\.[a-zA-Z]{2,}$).*)'],
}
