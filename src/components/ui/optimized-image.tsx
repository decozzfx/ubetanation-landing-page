"use client"

import Image, { ImageProps } from 'next/image'
import { useState, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showPlaceholder?: boolean
  placeholderClassName?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  optimized?: boolean
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video', 
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]'
}

export const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  ({ 
    src,
    alt,
    fallbackSrc,
    showPlaceholder = true,
    placeholderClassName,
    aspectRatio,
    optimized = true,
    className,
    ...props 
  }, ref) => {
    const [imageSrc, setImageSrc] = useState(src)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleLoad = () => {
      setImageLoaded(true)
    }

    const handleError = () => {
      setImageError(true)
      if (fallbackSrc) {
        setImageSrc(fallbackSrc)
      }
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          'relative overflow-hidden',
          aspectRatio && aspectRatioClasses[aspectRatio],
          className
        )}
      >
        {showPlaceholder && !imageLoaded && !imageError && (
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
              'animate-pulse',
              placeholderClassName
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
        
        <Image
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          // Performance optimizations
          priority={props.priority}
          loading={props.priority ? 'eager' : 'lazy'}
          quality={optimized ? 85 : 100}
          sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          {...props}
        />
        
        {imageError && !fallbackSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

// Preload images for critical content
export function preloadImage(src: string, priority: boolean = false) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = priority ? 'preload' : 'prefetch'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }
}

// Generate responsive image sizes for better performance
export function generateSrcSet(
  src: string, 
  widths: number[] = [640, 768, 1024, 1280, 1536, 1920]
): string {
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ')
}

// Create blur data URL for placeholder
export function createBlurDataURL(width: number = 8, height: number = 8): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

export default OptimizedImage