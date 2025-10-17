import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get client IP
    const clientId = getClientId(request);
    const now = Date.now();
    
    // Clean up expired entries
    cleanupExpiredEntries(now);
    
    // Get current rate limit data for client
    const key = `${clientId}`;
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs };
    
    // Reset if window has passed
    if (now > current.resetTime) {
      current.count = 0;
      current.resetTime = now + config.windowMs;
    }
    
    // Increment counter
    current.count++;
    rateLimitStore.set(key, current);
    
    // Check if limit exceeded
    if (current.count > config.max) {
      return NextResponse.json(
        { 
          error: config.message || "Too many requests",
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString(),
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString()
          }
        }
      );
    }
    
    return null; // Allow request to continue
  };
}

function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for reverse proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to connection IP (may not be available in all environments)
  const ip = (request as any).ip;
  return ip || 'unknown';
}

function cleanupExpiredEntries(now: number) {
  // Only cleanup occasionally to avoid performance issues
  if (Math.random() > 0.1) return;
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// CSRF Protection
const csrfTokenStore = new Map<string, number>();

export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex');
  csrfTokenStore.set(token, Date.now() + 3600000); // 1 hour expiry
  return token;
}

export function verifyCSRFToken(token: string): boolean {
  if (!token) return false;
  
  const expiry = csrfTokenStore.get(token);
  if (!expiry || Date.now() > expiry) {
    csrfTokenStore.delete(token);
    return false;
  }
  
  return true;
}

export function cleanupCSRFTokens() {
  const now = Date.now();
  for (const [token, expiry] of csrfTokenStore.entries()) {
    if (now > expiry) {
      csrfTokenStore.delete(token);
    }
  }
}

// Content Security Policy
export function getCSPHeader(): string {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Next.js dev mode
    "style-src 'self' 'unsafe-inline'", // Needed for inline styles
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  return csp;
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(),
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // XSS Protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Remove server information
    'X-Powered-By': '',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// SQL injection protection helpers
export function sanitizeForDatabase(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .trim();
}

// Password strength validation
export function validatePasswordStrength(password: string): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Secure session token generation
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Hash sensitive data
export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}