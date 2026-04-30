import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectVpn, getClientIp, isPrivateIp } from '@/lib/vpn-detect'

// Lightweight status endpoint for the client-side VpnWatcher. Returns just
// the boolean so the client can decide whether to navigate, without leaking
// the full ipapi.is payload to the page.
export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!ip || isPrivateIp(ip)) {
    return NextResponse.json({ blocked: false }, { headers: NO_CACHE })
  }
  const result = await detectVpn(ip)
  const blocked = result?.blocked === true
  return NextResponse.json({ blocked }, { headers: NO_CACHE })
}

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
}
