import { NextRequest, NextResponse } from "next/server";
import { fileUploadService, imageUploadConfig, documentUploadConfig } from "@/lib/upload";
import { verifySession } from "@/lib/auth";
import { rateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - simplified for build
    // TODO: Implement proper rate limiting

    // Verify authentication for file uploads
    const session = await verifySession(request);
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'document'
    const category = formData.get('category') as string; // 'projects', 'blog', or 'temp'

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate type parameter
    if (!type || !['image', 'document'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'image' or 'document'" },
        { status: 400 }
      );
    }

    // Validate category for images
    if (type === 'image' && category && !['projects', 'blog', 'temp'].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be 'projects', 'blog', or 'temp'" },
        { status: 400 }
      );
    }

    // Choose configuration based on type
    const config = type === 'image' ? imageUploadConfig : documentUploadConfig;

    // Validate file
    const validation = fileUploadService.validateFile(file, config);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename
    const filename = fileUploadService.generateUniqueFilename(file.name);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    let processedFile;

    try {
      if (type === 'image') {
        const imageCategory = (category as 'projects' | 'blog' | 'temp') || 'temp';
        processedFile = await fileUploadService.processImage(
          buffer,
          filename,
          config,
          imageCategory
        );
      } else {
        processedFile = await fileUploadService.processDocument(
          buffer,
          filename,
          file.name
        );
      }
    } catch (error) {
      console.error('File processing error:', error);
      return NextResponse.json(
        { error: "Failed to process file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: processedFile
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

// Get file info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const category = searchParams.get('category');

    if (!filename || !category) {
      return NextResponse.json(
        { error: "Missing filename or category" },
        { status: 400 }
      );
    }

    if (!['projects', 'blog', 'temp'].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const fileInfo = fileUploadService.getFileInfo(
      category as 'projects' | 'blog' | 'temp',
      filename
    );

    if (!fileInfo) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ file: fileInfo });

  } catch (error) {
    console.error("File info error:", error);
    return NextResponse.json(
      { error: "Failed to get file info" },
      { status: 500 }
    );
  }
}

// Delete file
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const session = await verifySession(request);
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const category = searchParams.get('category');

    if (!filename || !category) {
      return NextResponse.json(
        { error: "Missing filename or category" },
        { status: 400 }
      );
    }

    if (!['projects', 'blog', 'temp'].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const fileInfo = fileUploadService.getFileInfo(
      category as 'projects' | 'blog' | 'temp',
      filename
    );

    if (!fileInfo) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const deleted = await fileUploadService.deleteFile(fileInfo.path);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}