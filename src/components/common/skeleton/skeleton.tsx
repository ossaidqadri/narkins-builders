/** @deprecated
 * Kabeer's Network Authors 2025 (c)
 **/
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  )
}

// Card Skeleton for floor plans and amenities
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden",
        className
      )}
    >
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

// Gallery Image Skeleton
export function GallerySkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// Video Skeleton for YouTube sections
export function VideoSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full h-[200px] lg:h-[280px] rounded-3xl" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Hero Section Skeleton
export function HeroSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Video Player Skeleton */}
      <div className="px-4 bg-neutral-50 relative md:xl:px-0 w-full h-auto max-w-7xl mx-auto my-8 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-[300px] lg:h-[400px] rounded-xl" />
      </div>

      {/* Hero Text Skeleton */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 space-y-6">
          <Skeleton className="h-16 lg:h-20 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Floor Plans Section Skeleton
export function FloorPlansSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-black py-20", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-12 w-64 mx-auto bg-gray-800" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-800" />
        </div>

        {/* Tabs Skeleton */}
        <div className="w-full mt-10">
          <div className="flex space-x-1 gap-2 py-2 mb-5 rounded-xl">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 h-12 rounded-lg bg-gray-800"
              />
            ))}
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800"
              >
                <Skeleton className="w-full h-64 bg-gray-800" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-gray-800" />
                  <Skeleton className="h-4 w-full bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Amenities Section Skeleton
export function AmenitiesSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white py-20", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Amenities Grid Skeleton */}
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-[2/1] overflow-hidden rounded-lg"
              >
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Carousel Skeleton */}
          <Skeleton className="mt-16 h-[30rem] md:h-[35rem] lg:h-[40rem] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Testimonials Skeleton
export function TestimonialsSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white border-t px-5 lg:px-8 py-20", className)}>
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Testimonials Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Home Hero Skeleton
export function HomeHeroSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white py-20 lg:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <Skeleton className="h-16 lg:h-20 w-full max-w-4xl mx-auto" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-12 w-20 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Project Grid Skeleton
export function ProjectGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Blog Grid Skeleton
export function BlogGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      {/* Featured post */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <Skeleton className="w-full md:w-1/2 h-64" />
          <div className="p-6 md:w-1/2 space-y-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-10 h-10" />
        ))}
      </div>
    </div>
  )
}

// Blog Post Skeleton
export function BlogPostSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("max-w-4xl mx-auto space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-6">
        <Skeleton className="h-4 w-20 mx-auto" />
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Featured image */}
      <Skeleton className="w-full h-96 rounded-lg" />

      {/* Content */}
      <div className="prose max-w-none space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
    </div>
  )
}

// Stats Skeleton
export function StatsSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("py-16", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-3">
            <Skeleton className="h-16 w-20 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Feature Grid Skeleton
export function FeatureGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-12", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="text-center space-y-4">
            <Skeleton className="w-16 h-16 mx-auto rounded-xl" />
            <Skeleton className="h-6 w-32 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
