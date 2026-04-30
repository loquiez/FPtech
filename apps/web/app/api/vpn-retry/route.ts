import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildUrl } from '@/lib/vpn-detect'

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(buildUrl('/', request))
  // Clean up any leftover cache cookies from previous versions.
  response.cookies.delete('_vpc')
  response.cookies.delete('_vpc2')
  return response
}
