import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Only apply to generate-path API route
  if (request.nextUrl.pathname === '/api/generate-path') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user has credits
    if (token.credits === 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your account.' },
        { status: 403 }
      );
    }
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/api/generate-path'],
}; 