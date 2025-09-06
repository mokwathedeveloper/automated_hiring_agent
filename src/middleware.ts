import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders } from '@/lib/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /nessus/i,
    /openvas/i,
    /burpsuite/i,
    /owasp/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return new Response('Forbidden', { status: 403 });
  }

  // Block requests with suspicious paths
  const pathname = request.nextUrl.pathname;
  const suspiciousPaths = [
    /\.php$/,
    /\.asp$/,
    /\.jsp$/,
    /admin/i,
    /wp-admin/i,
    /phpmyadmin/i,
    /\.env/,
    /\.git/,
    /\.svn/,
    /backup/i,
    /config/i,
    /database/i,
    /\.sql$/,
    /\.bak$/
  ];

  if (suspiciousPaths.some(pattern => pattern.test(pathname))) {
    return new Response('Not Found', { status: 404 });
  }

  // Block requests with suspicious query parameters
  const url = request.nextUrl;
  const queryString = url.search;
  const suspiciousQueries = [
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /delete.*from/i,
    /update.*set/i,
    /<script/i,
    /javascript:/i,
    /eval\(/i,
    /exec\(/i,
    /system\(/i,
    /passthru\(/i,
    /shell_exec/i,
    /base64_decode/i,
    /file_get_contents/i,
    /fopen/i,
    /fwrite/i,
    /include/i,
    /require/i
  ];

  if (suspiciousQueries.some(pattern => pattern.test(queryString))) {
    return new Response('Bad Request', { status: 400 });
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Additional rate limiting can be implemented here
    // For now, we rely on the per-endpoint rate limiting
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};