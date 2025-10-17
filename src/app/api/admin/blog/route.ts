import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: [
        { status: 'desc' }, // Published posts first
        { updatedAt: 'desc' }
      ],
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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      tags,
      status,
      slug,
      metaTitle,
      metaDescription,
    } = body;

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        tags: JSON.stringify(tags || []),
        status: status || "draft",
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}