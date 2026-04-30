import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildUrl, detectVpn, getClientIp, isPrivateIp } from '@/lib/vpn-detect'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/vpn-blocked')) {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  if (!ip || isPrivateIp(ip)) return NextResponse.next()

  const result = await detectVpn(ip)
  if (!result) {
    return NextResponse.next()
  }

  console.log(`[vpn-check] ip=${ip} blocked=${result.blocked} reason=${result.reason}`)

  if (result.blocked) {
    return NextResponse.redirect(buildUrl('/vpn-blocked/', request))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\.[a-zA-Z]{2,}$).*)'],
}
