"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ProjectImage {
  id: number
  url: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: ProjectImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }
  }

  // Add keyboard event listener
  useState(() => {
    document.addEventListener('keydown', handleKeyDown as any)
    return () => document.removeEventListener('keydown', handleKeyDown as any)
  })

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => openModal(index)}
          >
            <div className="relative aspect-video">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-white/90 rounded-full shadow-lg"
                >
                  <ZoomIn className="h-6 w-6 text-slate-700" />
                </motion.div>
              </div>
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={images[currentIndex].url}
                  alt={images[currentIndex].alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {images[currentIndex].caption || images[currentIndex].alt}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-sm">
                    {currentIndex + 1} of {images.length}
                  </p>
                  <div className="flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}