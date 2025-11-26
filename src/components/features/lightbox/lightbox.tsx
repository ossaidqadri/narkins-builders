// src/components/lightbox/lightbox.tsx
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/common/ui/button"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useLightboxStore } from "@/zustand"
import { getImageAltText } from "@/data/image-alt-texts"

export const Lightbox: React.FC = () => {
  const { image, open, closeLightbox } = useLightboxStore()
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    if (open) {
      setIsLoading(true)
    }
  }, [open, image])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [open, closeLightbox])

  if (!image) return null

  // Generate SEO-friendly alt text for lightbox
  const filename = image.src.split("/").pop() || ""
  const lightboxAltText = getImageAltText(filename, undefined, "lightbox")

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white cursor-pointer flex items-center justify-center"
      onClick={closeLightbox}
      style={{ visibility: open ? "visible" : "hidden", opacity: open ? 1 : 0 }}
    >
      {/* Header with Close Button */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-end p-4 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            closeLightbox()
          }}
          className="text-neutral-700 hover:text-black"
        >
          <XMarkIcon className="h-10 w-10" />
        </Button>
      </div>

      {/* Image Container */}
      <div
        tabIndex={-1}
        className="relative max-w-6xl w-full h-full flex items-center justify-center p-4"
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        {/* Main Image with SEO Alt Text */}
        <Image
          src={image.src}
          alt={lightboxAltText}
          onClick={(e) => e.stopPropagation()}
          onLoad={handleImageLoad}
          onError={handleImageError}
          width={800}
          height={600}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  )
}

export default Lightbox
