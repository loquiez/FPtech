import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const home = new URL('/', request.url)
  const response = NextResponse.redirect(home)
  response.cookies.delete('_vpc')
  response.cookies.delete('_vpc2')
  return response
}
