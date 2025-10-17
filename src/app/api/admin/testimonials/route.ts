import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ];
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.testimonial.count({ where });

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
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
    const { name, role, company, content, rating, avatar, featured, status, order } = body;

    if (!name || !role || !content) {
      return NextResponse.json(
        { error: "Name, role, and content are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company,
        content,
        rating: rating || 5,
        avatar,
        featured: featured || false,
        status: status || "published",
        order: order || 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}