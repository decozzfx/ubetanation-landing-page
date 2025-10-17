import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // ID should be a string (cuid), not a number
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        title: true,
        client: true,
        description: true,
        technologies: true,
        demoUrl: true,
        repoUrl: true,
        coverImage: true,
        galleryImages: true,
        goals: true,
        challenges: true,
        solution: true,
        results: true,
        featured: true,
        status: true,
        createdAt: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse gallery images from JSON string
    const galleryImages = project.galleryImages ? JSON.parse(project.galleryImages) : [];
    const images = [
      {
        id: 1,
        url: project.coverImage,
        alt: `${project.title} - Main Screenshot`,
        caption: "Main application interface"
      },
      ...galleryImages.map((url: string, index: number) => ({
        id: index + 2,
        url,
        alt: `${project.title} - Screenshot ${index + 1}`,
        caption: `Project screenshot ${index + 1}`
      }))
    ];

    // Map Prisma fields to frontend expected fields
    const mappedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.goals || project.description,
      technologies: JSON.parse(project.technologies || '[]'),
      liveUrl: project.demoUrl,
      githubUrl: project.repoUrl,
      imageUrl: project.coverImage,
      category: project.client || 'Web Development',
      status: project.status === 'published' ? 'completed' : 'in-progress',
      createdAt: project.createdAt
    };

    return NextResponse.json({
      project: mappedProject,
      images
    });
  } catch (error) {
    console.error("Project detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}