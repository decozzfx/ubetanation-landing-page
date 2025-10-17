"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 5, 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("images", file);
      });

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = [...value, ...data.images];
        onChange(newImages);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to upload images");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const triggerFileSelect = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileSelect}
          disabled={disabled || isUploading || value.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
        <span className="text-sm text-gray-500">
          {value.length}/{maxImages} images
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3e%3crect width='100' height='100' fill='%23f3f4f6'/%3e%3ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='12'%3eImage Error%3c/text%3e%3c/svg%3e";
                  }}
                />
              </div>
              
              {/* Remove Button */}
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* Image Index */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index === 0 ? "Cover" : index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerFileSelect}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Click to upload project images</p>
          <p className="text-sm text-gray-500">
            Upload up to {maxImages} images. First image will be used as cover.
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            Uploading images...
          </div>
        </div>
      )}
    </div>
  );
}