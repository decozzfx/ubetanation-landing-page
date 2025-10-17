import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, user) => {
    return NextResponse.json({
      success: true,
      message: "Access granted to protected route",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  });
}