import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredProjects = await prisma.project.findMany({
      where: {
        featured: true,
        status: "published"
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3, // Get up to 3 featured projects for homepage
      select: {
        id: true,
        title: true,
        description: true,
        client: true,
        technologies: true,
        coverImage: true,
        status: true,
        featured: true
      }
    });

    return NextResponse.json(featuredProjects);
  } catch (error) {
    console.error("Featured projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}