import { NextRequest, NextResponse } from "next/server";
import { getSecurityHeaders, rateLimit } from "@/lib/security";

// Rate limiting configurations for different endpoints
const authLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many authentication attempts, please try again later"
});

const authSessionRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 session checks per 5 minutes (reasonable for dashboard)
  message: "Too many session validation requests, please slow down"
});

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 100, // 100 requests per 15 minutes
  message: "Too many API requests, please slow down"
});

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 admin requests per 15 minutes
  message: "Too many admin requests, please slow down"
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting based on path
  let rateLimitResponse: NextResponse | null = null;
  
  if (pathname.startsWith('/api/auth/')) {
    // Different rate limits for different auth endpoints
    if (pathname === '/api/auth/login' || pathname === '/api/auth/register') {
      rateLimitResponse = await authLoginRateLimit(request);
    } else {
      // More lenient for session validation endpoints like /api/auth/me
      rateLimitResponse = await authSessionRateLimit(request);
    }
  } else if (pathname.startsWith('/api/admin/')) {
    rateLimitResponse = await adminRateLimit(request);
  } else if (pathname.startsWith('/api/')) {
    rateLimitResponse = await apiRateLimit(request);
  }
  
  // Return rate limit response if limit exceeded
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Continue with the request
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Additional security measures for admin routes
  if (pathname.startsWith('/admin/')) {
    // Prevent caching of admin pages
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Additional admin security headers
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    // Only allow same-origin requests for admin APIs
    if (pathname.startsWith('/api/admin/')) {
      response.headers.set('Access-Control-Allow-Origin', request.nextUrl.origin);
    } else {
      // For public APIs, you might want more permissive CORS
      response.headers.set('Access-Control-Allow-Origin', request.nextUrl.origin);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};