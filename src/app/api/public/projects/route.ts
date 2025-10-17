import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        client: true,
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

    // Transform the projects to match frontend expected format
    const transformedProjects = projects.map(project => ({
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
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}