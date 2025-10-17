import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection by counting records
    const projectCount = await prisma.project.count();
    const blogPostCount = await prisma.blogPost.count();
    const userCount = await prisma.user.count();
    const analyticsCount = await prisma.analytics.count();
    const messageCount = await prisma.contactMessage.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        projects: projectCount,
        blogPosts: blogPostCount,
        users: userCount,
        analytics: analyticsCount,
        messages: messageCount,
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}