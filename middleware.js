import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  console.log('Middleware processing:', pathname);

  // Allow Next.js static assets (JavaScript, CSS, images, etc.)
  if (pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icon.png') ||
    pathname.includes('.') && (pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.svg'))) {
    console.log('Allowing static asset:', pathname);
    return NextResponse.next()
  }

  // If path starts with /.well-known/, 
  if (pathname.startsWith('/zh_HK/.well-known/') || pathname.startsWith('/.well-known/')) {
    console.log('Allowing well-known:', pathname);
    return NextResponse.next()
  }

  // Allow trip routes - PRIORITY CHECK
  if (pathname.startsWith('/trip/')) {
    console.log('✅ ALLOWING TRIP ROUTE:', pathname);
    return NextResponse.next()
  }

  if (pathname.startsWith('/zh_HK/trip/')) {
    console.log('✅ ALLOWING ZH_HK TRIP ROUTE:', pathname);
    return NextResponse.next()
  }


  // Otherwise, send traffic to Odoo
  console.log('Redirecting to Odoo:', pathname);
  return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
}


// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const { pathname } = request.nextUrl

//   // If path starts with /.well-known/, 
//   if (pathname.startsWith('/zh_HK/.well-known/') || pathname.startsWith('/.well-known/')) {
//     return NextResponse.next()
//   }

//   // Allow Next.js static assets (JavaScript, CSS, images, etc.)
//   if (pathname.startsWith('/_next/') ||
//     pathname.startsWith('/static/') ||
//     pathname.startsWith('/favicon.ico') ||
//     pathname.startsWith('/icon.png') ||
//     pathname.includes('.') && (pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.svg'))) {
//     console.log('Allowing static asset:', pathname);
//     return NextResponse.next()
//   }

//   // Allow trip routes - PRIORITY CHECK
//   if (pathname.startsWith('/trip/')) {
//     console.log('✅ ALLOWING TRIP ROUTE:', pathname);
//     return NextResponse.next()
//   }

//   if (pathname.startsWith('/zh_HK/trip/')) {
//     console.log('✅ ALLOWING ZH_HK TRIP ROUTE:', pathname);
//     return NextResponse.next()
//   }

//   // Otherwise, send traffic to Odoo
//   return NextResponse.rewrite('https://layover-ai.odoo.com' + pathname)
// } 