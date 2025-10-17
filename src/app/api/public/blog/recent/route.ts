import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recentPosts = await prisma.blogPost.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6, // Get up to 6 recent posts
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImage: true,
        slug: true,
        createdAt: true,
        tags: true
      }
    });

    return NextResponse.json(recentPosts);
  } catch (error) {
    console.error("Recent blog posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent blog posts" },
      { status: 500 }
    );
  }
}