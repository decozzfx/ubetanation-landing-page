import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSessionToken, checkRateLimit, clearRateLimit, COOKIE_OPTIONS, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Too many login attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        },
        { status: 429 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Clear rate limit on successful login
    clearRateLimit(clientIP);

    // Create session token
    const sessionToken = await createSessionToken(user.id);

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    // Set secure session cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}