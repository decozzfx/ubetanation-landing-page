import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalProjects, totalBlogPosts, totalContacts, totalAnalytics] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.contactMessage.count(),
      prisma.analytics.aggregate({
        _sum: { views: true }
      }).then(result => result._sum.views || 0),
    ]);

    const stats = {
      totalProjects,
      totalBlogPosts,
      totalContacts,
      totalAnalytics,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}