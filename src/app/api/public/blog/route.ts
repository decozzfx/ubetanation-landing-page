import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        tags: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}