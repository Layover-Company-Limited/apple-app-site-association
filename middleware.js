import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // If path starts with /.well-known/, 
  if (pathname.startsWith('/zh_HK/.well-known/')|| pathname.startsWith('/.well-known/')) {
    return NextResponse.next()
  }

    // If path starts with /app-ads/, 
  if (pathname == '/app-ads.txt' || pathname == '/zh_HK/app-ads.txt' || pathname == '/ads.txt' || pathname == '/zh_HK/ads.txt' ) {
    return NextResponse.next()
  }

    // If path starts with /robots.txt/, 
  if (pathname == '/robots.txt' || pathname == '/zh_HK/robots.txt') {
    return NextResponse.next()
  }

  // Otherwise, send traffic to Odoo
  return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
} 