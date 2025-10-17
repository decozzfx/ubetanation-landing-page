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
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
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
      client,
      description,
      technologies,
      demoUrl,
      repoUrl,
      coverImage,
      galleryImages,
      goals,
      challenges,
      solution,
      results,
      featured,
      status,
    } = body;

    // Validate required fields
    if (!title || !client || !description) {
      return NextResponse.json(
        { error: "Title, client, and description are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        client,
        description,
        technologies: JSON.stringify(technologies || []),
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        coverImage: coverImage || "",
        galleryImages: galleryImages ? JSON.stringify(galleryImages) : null,
        goals: goals || null,
        challenges: challenges || null,
        solution: solution || null,
        results: results || null,
        featured: featured || false,
        status: status || "draft",
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update project" },
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
    
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project deletion error:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}