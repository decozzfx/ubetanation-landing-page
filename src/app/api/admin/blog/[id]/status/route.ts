import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    const { status } = body;

    if (!status || (status !== "draft" && status !== "published")) {
      return NextResponse.json(
        { error: "Valid status (draft or published) is required" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post status update error:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update blog post status" },
      { status: 500 }
    );
  }
}