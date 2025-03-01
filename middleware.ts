import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Only apply to generate-path API route
  if (request.nextUrl.pathname === '/api/generate-path') {
    console.log('Middleware: Processing request to /api/generate-path');
    console.log('Cookies:', request.cookies);
    
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });    
    
    // For debugging
    console.log('Middleware token:', token);
    
    // Check if user is authenticated
    if (!token) {
      console.log('Middleware: No token found, authentication required');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user has credits
    if (token.credits === 0) {
      console.log('Middleware: User has no credits');
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your account.' },
        { status: 403 }
      );
    }
    
    console.log('Middleware: Authentication successful, proceeding to API route');
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/api/generate-path'],
}; 