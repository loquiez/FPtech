import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectVpn, getClientIp, isPrivateIp } from '@/lib/vpn-detect'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const headers = {
    host: request.headers.get('host'),
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'user-agent': request.headers.get('user-agent'),
  }
  const requestUrl = request.url

  if (!ip) {
    return NextResponse.json({ ok: false, error: 'no_ip', headers, requestUrl })
  }

  if (isPrivateIp(ip)) {
    return NextResponse.json({ ok: true, ip, skipped: 'private_ip', headers, requestUrl })
  }

  const result = await detectVpn(ip)
  return NextResponse.json({ ok: true, ip, result, headers, requestUrl })
}
