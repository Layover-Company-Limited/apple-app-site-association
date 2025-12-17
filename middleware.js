import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // If path starts with /.well-known/, 
  if (pathname.startsWith('/zh_HK/.well-known/')|| pathname.startsWith('/.well-known/')) {
    return NextResponse.next()
  }

    // If path starts with /app-ads/, 
  if (pathname.startsWith('/app-ads/')) {
    return NextResponse.next()
  }

  // Otherwise, send traffic to Odoo
  return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
} 