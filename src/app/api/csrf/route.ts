import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken, cleanupCSRFTokens } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    // Clean up expired tokens periodically
    if (Math.random() < 0.1) {
      cleanupCSRFTokens();
    }
    
    // Generate new CSRF token
    const token = generateCSRFToken();
    
    const response = NextResponse.json({
      csrfToken: token
    });
    
    // Set CSRF token as a cookie as well (for forms)
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600 // 1 hour
    });
    
    return response;
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}