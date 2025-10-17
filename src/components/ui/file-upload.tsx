"use client"

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useFileUpload, formatFileSize } from '@/hooks/useFileUpload';
import Image from 'next/image';

interface FileUploadProps {
  type: 'image' | 'document';
  category?: 'projects' | 'blog' | 'temp';
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileUploaded?: (file: any) => void;
  onFileRemoved?: (filename: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({
  type,
  category = 'temp',
  accept,
  maxSize = type === 'image' ? 10 : 50,
  multiple = false,
  onFileUploaded,
  onFileRemoved,
  className = '',
  children
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const { uploadFile, deleteFile, isUploading, progress, error, reset } = useFileUpload({
    type,
    category,
    onSuccess: (file) => {
      setUploadedFiles(prev => [...prev, file]);
      onFileUploaded?.(file);
    },
    onError: (error) => {
      console.error('Upload error:', error);
    }
  });

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is ${maxSize}MB.`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveFile = async (file: any) => {
    const success = await deleteFile(file.filename, category);
    if (success) {
      setUploadedFiles(prev => prev.filter(f => f.filename !== file.filename));
      onFileRemoved?.(file.filename);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getAcceptString = () => {
    if (accept) return accept;
    if (type === 'image') return 'image/*';
    if (type === 'document') return '.pdf,.doc,.docx,.txt';
    return '*/*';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`relative border-2 border-dashed transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptString()}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-4 rounded-full ${
              dragActive ? 'bg-primary text-primary-foreground' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {type === 'image' ? (
                <ImageIcon className="h-8 w-8" />
              ) : (
                <File className="h-8 w-8" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {children || `Upload ${type === 'image' ? 'Images' : 'Documents'}`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-slate-500">
                Maximum file size: {maxSize}MB
              </p>
            </div>

            <Button variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        </CardContent>

        {/* Upload Progress */}
        <AnimatePresence>
          {isUploading && progress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="text-sm font-medium">Uploading...</div>
                <Progress value={progress.percentage} className="w-48" />
                <div className="text-xs text-slate-500">
                  {progress.percentage}% ({formatFileSize(progress.loaded)} / {formatFileSize(progress.total)})
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Upload Error
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {error}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={reset}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium">Uploaded Files</h4>
            <div className="grid grid-cols-1 gap-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={file.filename}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        {type === 'image' && file.url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                            <Image
                              src={file.url}
                              alt={file.originalName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                            <File className="h-6 w-6 text-slate-600" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.originalName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                          {file.width && file.height && (
                            <Badge variant="outline" className="text-xs">
                              {file.width} × {file.height}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFile(file)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}