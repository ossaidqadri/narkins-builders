"use client"

import React, { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface ZoomableImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  caption?: string
  priority?: boolean
}

export function ZoomableImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  caption,
  priority = false,
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const openZoom = () => setIsZoomed(true)
  const closeZoom = () => setIsZoomed(false)

  return (
    <>
      {/* Regular Image */}
      <div className={`relative ${className}`}>
        <div className="relative overflow-hidden rounded-lg border-2 border-blue-200">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto cursor-pointer"
            onClick={openZoom}
            priority={priority}
          />
        </div>

        {/* Caption */}
        {caption && (
          <p className="text-sm text-gray-600 text-center mt-3 italic">
            {caption}
          </p>
        )}
      </div>

      {/* Zoomed Modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-90"
              onClick={closeZoom}
            />

            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoomed Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] m-4"
            >
              <Image
                src={src}
                alt={alt}
                width={width * 2}
                height={height * 2}
                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg"
                priority
              />

              {/* Caption in modal */}
              {caption && (
                <p className="text-white text-center mt-4 text-sm">{caption}</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ZoomableImage
