import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
  quality: number; // for image compression
  maxWidth?: number;
  maxHeight?: number;
}

export const imageUploadConfig: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  quality: 80,
  maxWidth: 2048,
  maxHeight: 2048,
};

export const documentUploadConfig: UploadConfig = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
  quality: 100, // No compression for documents
};

export interface ProcessedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export class FileUploadService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.baseUrl = '/uploads';
    this.ensureUploadDirectories();
  }

  private ensureUploadDirectories() {
    const directories = [
      this.uploadDir,
      path.join(this.uploadDir, 'images'),
      path.join(this.uploadDir, 'images', 'projects'),
      path.join(this.uploadDir, 'images', 'blog'),
      path.join(this.uploadDir, 'images', 'temp'),
      path.join(this.uploadDir, 'documents'),
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  validateFile(file: File, config: UploadConfig): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${(config.maxFileSize / (1024 * 1024)).toFixed(1)}MB limit`
      };
    }

    // Check MIME type
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    const extension = path.extname(file.name).toLowerCase();
    if (!config.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension ${extension} is not allowed`
      };
    }

    return { valid: true };
  }

  generateUniqueFilename(originalName: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const uuid = uuidv4().slice(0, 8);
    const timestamp = Date.now();
    
    // Clean filename - remove special characters and spaces
    const cleanBaseName = baseName
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    
    return `${cleanBaseName}-${timestamp}-${uuid}${extension}`;
  }

  async processImage(
    buffer: Buffer,
    filename: string,
    config: UploadConfig,
    category: 'projects' | 'blog' | 'temp' = 'temp'
  ): Promise<ProcessedFile> {
    const outputDir = path.join(this.uploadDir, 'images', category);
    const outputPath = path.join(outputDir, filename);

    let sharpInstance = sharp(buffer);

    // Get original image metadata
    const metadata = await sharpInstance.metadata();

    // Resize if needed
    if (config.maxWidth || config.maxHeight) {
      sharpInstance = sharpInstance.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Apply compression and convert to webp for better performance (optional)
    const processedBuffer = await sharpInstance
      .jpeg({ quality: config.quality, progressive: true })
      .toBuffer();

    // Write file
    await fs.promises.writeFile(outputPath, processedBuffer);

    // Get processed image info
    const processedMetadata = await sharp(outputPath).metadata();
    const stats = await fs.promises.stat(outputPath);

    return {
      filename,
      originalName: filename,
      path: outputPath,
      url: `${this.baseUrl}/images/${category}/${filename}`,
      size: stats.size,
      mimeType: 'image/jpeg',
      width: processedMetadata.width,
      height: processedMetadata.height,
    };
  }

  async processDocument(
    buffer: Buffer,
    filename: string,
    originalName: string
  ): Promise<ProcessedFile> {
    const outputDir = path.join(this.uploadDir, 'documents');
    const outputPath = path.join(outputDir, filename);

    // Write file as-is for documents
    await fs.promises.writeFile(outputPath, buffer);

    const stats = await fs.promises.stat(outputPath);

    return {
      filename,
      originalName,
      path: outputPath,
      url: `${this.baseUrl}/documents/${filename}`,
      size: stats.size,
      mimeType: this.getMimeTypeFromExtension(filename),
    };
  }

  private getMimeTypeFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async moveFile(
    fromCategory: 'projects' | 'blog' | 'temp',
    toCategory: 'projects' | 'blog' | 'temp',
    filename: string
  ): Promise<string | null> {
    try {
      const fromPath = path.join(this.uploadDir, 'images', fromCategory, filename);
      const toPath = path.join(this.uploadDir, 'images', toCategory, filename);

      if (!fs.existsSync(fromPath)) {
        return null;
      }

      await fs.promises.rename(fromPath, toPath);
      return `${this.baseUrl}/images/${toCategory}/${filename}`;
    } catch (error) {
      console.error('Error moving file:', error);
      return null;
    }
  }

  getFileInfo(category: 'projects' | 'blog' | 'temp', filename: string): ProcessedFile | null {
    try {
      const filePath = path.join(this.uploadDir, 'images', category, filename);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const stats = fs.statSync(filePath);
      
      return {
        filename,
        originalName: filename,
        path: filePath,
        url: `${this.baseUrl}/images/${category}/${filename}`,
        size: stats.size,
        mimeType: this.getMimeTypeFromExtension(filename),
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }
}

export const fileUploadService = new FileUploadService();