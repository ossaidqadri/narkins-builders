// src/components/seo-image/seo-image.tsx
import Image from "next/image"
import { FC } from "react"
import { getImageAltText } from "@/data/image-alt-texts"

interface SEOImageProps {
  src: string
  alt?: string // Optional override
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
  onClick?: () => void
  loading?: "lazy" | "eager"
  // New props for dynamic SEO optimization
  context?: "carousel" | "gallery" | "lightbox" | "general"
  index?: number // For carousel/gallery images
}

/**
 * SEO-optimized Image component with automatic alt text generation
 * Uses centralized alt text mappings for consistency
 * Supports dynamic context-based alt text for carousels, galleries, etc.
 */
const SEOImage: FC<SEOImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  fill = false,
  style,
  onClick,
  loading = "lazy",
  context = "general",
  index,
}) => {
  // Extract filename from src path
  const filename = src.split("/").pop() || ""

  // Get SEO-optimized alt text (uses centralized data with context support)
  const seoAltText = alt || getImageAltText(filename, undefined, context, index)

  // Build image props object
  const imageProps = {
    src,
    alt: seoAltText,
    className,
    priority,
    sizes,
    quality,
    style,
    onClick,
    loading,
    ...(fill ? { fill: true } : { width, height }),
  }

  return <Image {...imageProps} alt={seoAltText} />
}

export default SEOImage
