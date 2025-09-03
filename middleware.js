import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // If path starts with /.well-known/, 
  if (pathname.startsWith('/zh-HK/.well-known/')|| pathname.startsWith('/.well-known/')) {
    return NextResponse.next()
  }

  // Otherwise, send traffic to Odoo
  return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
}