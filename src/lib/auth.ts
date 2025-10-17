import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { verifyCSRFToken } from "./security";
import type { User } from "@/types";

// Configuration
const SALT_ROUNDS = 12;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities for sessions
export async function createSessionToken(userId: string): Promise<string> {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + SESSION_DURATION) / 1000),
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// User authentication
export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

// Get user from session
export async function getUserFromSession(sessionToken: string): Promise<User | null> {
  try {
    const payload = await verifySessionToken(sessionToken);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

// CSRF Protection for authenticated requests
export function verifyCSRFProtection(request: any): boolean {
  const method = request.method?.toUpperCase();
  
  // Only check CSRF for state-changing operations
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }
  
  // Get CSRF token from header or cookie
  const tokenFromHeader = request.headers.get('x-csrf-token');
  const tokenFromCookie = request.cookies.get('csrf-token')?.value;
  
  const token = tokenFromHeader || tokenFromCookie;
  
  return verifyCSRFToken(token);
}

// Session cookie configuration
export const SESSION_COOKIE_NAME = "session";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION / 1000, // Convert to seconds
  path: "/",
};

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;
  loginAttempts.set(identifier, attempts);

  return { allowed: true };
}

export function clearRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Verify session from NextRequest
export async function verifySession(request: NextRequest): Promise<User | null> {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionToken) {
      return null;
    }

    return await getUserFromSession(sessionToken);
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}