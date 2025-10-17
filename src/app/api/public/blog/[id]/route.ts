import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Blog posts use string IDs (cuid)
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: {
        id: id
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

    if (!post || post.status !== 'published') {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Get related posts based on similar tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        id: { not: id },
        status: "published",
        OR: JSON.parse(post.tags || '[]').map((tag: string) => ({
          tags: {
            has: tag
          }
        }))
      },
      take: 3,
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
        createdAt: true
      }
    });

    return NextResponse.json({
      post,
      relatedPosts
    });
  } catch (error) {
    console.error("Blog post detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post details" },
      { status: 500 }
    );
  }
}