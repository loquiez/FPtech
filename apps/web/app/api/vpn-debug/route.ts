import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectVpn, getClientIp, isPrivateIp } from '@/lib/vpn-detect'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'user-agent': request.headers.get('user-agent'),
  }

  if (!ip) {
    return NextResponse.json({ ok: false, error: 'no_ip', headers }, { status: 200 })
  }

  if (isPrivateIp(ip)) {
    return NextResponse.json({ ok: true, ip, skipped: 'private_ip', headers }, { status: 200 })
  }

  const result = await detectVpn(ip)
  return NextResponse.json({ ok: true, ip, result, headers }, { status: 200 })
}
