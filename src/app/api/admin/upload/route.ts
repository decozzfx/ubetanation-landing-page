import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedImages: string[] = [];

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `${timestamp}-${randomString}.${fileExtension}`;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      // Add to uploaded images array
      uploadedImages.push(`/uploads/projects/${filename}`);
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}