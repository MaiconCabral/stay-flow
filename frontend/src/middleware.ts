import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const hostOnlyPaths = ['/dashboard/imoveis', '/dashboard/ganhos']
const authPaths = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Auth check is handled client-side via localStorage + AuthContext.
  // This middleware provides the foundation for server-side auth when
  // cookies are integrated with Sanctum SPA authentication.
  // TODO: Read Sanctum session cookie to verify auth server-side
  // TODO: Read user role from cookie/session to redirect guests from host-only paths

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
