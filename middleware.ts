import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const token = req.cookies.get('admin_token')?.value
  const expected = process.env.ADMIN_PASSWORD

  if (token && token === expected) return NextResponse.next()

  const loginUrl = new URL('/admin/login', req.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
