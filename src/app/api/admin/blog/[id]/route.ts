import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if slug already exists for another post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost && existingPost.id !== id) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { id },
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

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post update error:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog post deletion error:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}