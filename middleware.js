import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // If path starts with /.well-known/, 
  if (pathname.startsWith('/.well-known/')) {
    const url = new URL(request.url)
    url.hostname = 'https://apple-app-site-association-nine.vercel.app' // target host
    return NextResponse.rewrite(url) // proxy
  }

  // Otherwise, send traffic to Odoo
  return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
}