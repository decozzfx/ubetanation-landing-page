import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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

    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}