import { NextRequest, NextResponse } from "next/server";
import { fileUploadService } from "@/lib/upload";
import { verifySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await verifySession(request);
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { filename, fromCategory, toCategory } = body;

    if (!filename || !fromCategory || !toCategory) {
      return NextResponse.json(
        { error: "Missing required fields: filename, fromCategory, toCategory" },
        { status: 400 }
      );
    }

    const validCategories = ['projects', 'blog', 'temp'];
    if (!validCategories.includes(fromCategory) || !validCategories.includes(toCategory)) {
      return NextResponse.json(
        { error: "Invalid category. Must be 'projects', 'blog', or 'temp'" },
        { status: 400 }
      );
    }

    if (fromCategory === toCategory) {
      return NextResponse.json(
        { error: "Source and destination categories cannot be the same" },
        { status: 400 }
      );
    }

    const newUrl = await fileUploadService.moveFile(
      fromCategory as 'projects' | 'blog' | 'temp',
      toCategory as 'projects' | 'blog' | 'temp',
      filename
    );

    if (!newUrl) {
      return NextResponse.json(
        { error: "Failed to move file. File may not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      newUrl
    });

  } catch (error) {
    console.error("File move error:", error);
    return NextResponse.json(
      { error: "Failed to move file" },
      { status: 500 }
    );
  }
}