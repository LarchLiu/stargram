import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// import { rewrite } from '@vercel/edge'

// config with custom matcher
export const config = {
  matcher: '/api/github-og.png',
}

export default function middleware(request: NextRequest) {
  const url = new URL(request.url.replace('/api/github-og.png', '/api/github-og'))
  return NextResponse.redirect(url)
}
