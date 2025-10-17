import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {
      status: "published",
    };

    if (featured === "true") {
      where.featured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        content: true,
        rating: true,
        avatar: true,
        featured: true,
        order: true,
      },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching public testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}