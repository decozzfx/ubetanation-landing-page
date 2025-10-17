"use client"

import { useState, useCallback } from 'react';

interface UploadedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseFileUploadOptions {
  type: 'image' | 'document';
  category?: 'projects' | 'blog' | 'temp';
  onSuccess?: (file: UploadedFile) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type);
    
    if (options.category) {
      formData.append('category', options.category);
    }

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressData = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          setProgress(progressData);
          options.onProgress?.(progressData);
        }
      });

      const response = await new Promise<Response>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(new Response(xhr.responseText, {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }));
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      const uploadedFileData = result.file;
      setUploadedFile(uploadedFileData);
      options.onSuccess?.(uploadedFileData);
      
      return uploadedFileData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
    setUploadedFile(null);
  }, []);

  const deleteFile = useCallback(async (filename: string, category: string) => {
    try {
      const response = await fetch(`/api/upload?filename=${filename}&category=${category}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Delete failed');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return false;
    }
  }, []);

  const moveFile = useCallback(async (
    filename: string, 
    fromCategory: string, 
    toCategory: string
  ) => {
    try {
      const response = await fetch('/api/upload/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          fromCategory,
          toCategory,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Move failed');
      }

      const result = await response.json();
      return result.newUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Move failed';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    uploadFile,
    deleteFile,
    moveFile,
    reset,
    isUploading,
    progress,
    error,
    uploadedFile,
  };
}

// Utility function for file validation on the client side
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}