import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    
    // Clean up expired entries
    const entries = Array.from(rateLimit.entries());
    for (const [key, value] of entries) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
    
    // Get or create rate limit entry
    const entry = rateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    // Check if rate limit exceeded
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS && now < entry.resetTime) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Increment counter
    entry.count++;
    rateLimit.set(ip, entry);
    
    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};