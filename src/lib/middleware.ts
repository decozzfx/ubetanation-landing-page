import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession, SESSION_COOKIE_NAME } from "./auth";

// Auth middleware for API routes
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<Response>
): Promise<Response> {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid session" },
      { status: 401 }
    );
  }

  return handler(request, user);
}

// Check if user is authenticated (for client-side use)
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  const user = await getUserFromSession(sessionToken);
  return user !== null;
}

// Get current user from request
export async function getCurrentUser(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  return getUserFromSession(sessionToken);
}