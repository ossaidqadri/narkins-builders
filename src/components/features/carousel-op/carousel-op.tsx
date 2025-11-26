// src/components/carousel-op/carousel-op.tsx
import React, { useEffect, useRef, useState } from "react"
import SEOImage from "@/components/common/seo-image/seo-image"

interface CarouselOpProps {
  dataSource: { image: string; name?: string }[]
  autoPlay?: boolean
  autoPlayInterval?: number
  hideArrows?: boolean
  hideIndicators?: boolean
  height?: string
  borderRadius?: boolean
  swipe?: boolean
  slideShow?: boolean
  loop?: boolean
  rightToLeft?: boolean
  keyboard?: boolean
  displayMode?: string
  interval?: number
  id?: string
  className?: string
  onChange?: (index: number) => void
  hideCaption?: boolean
}

const CarouselOp: React.FC<CarouselOpProps> = ({
  dataSource,
  autoPlay = false,
  autoPlayInterval = 3000,
  hideArrows = false,
  hideIndicators = false,
  height = "500px",
  borderRadius = false,
  onChange,
  hideCaption = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = dataSource.length - 1
    } else if (newIndex >= dataSource.length) {
      newIndex = 0
    }
    setCurrentIndex(newIndex)
    onChange?.(newIndex)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && dataSource.length > 1) {
      intervalRef.current = setInterval(() => {
        updateIndex(currentIndex + 1)
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, isAutoPlaying, autoPlayInterval, dataSource.length])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsAutoPlaying(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      updateIndex(currentIndex + 1)
    } else if (isRightSwipe) {
      updateIndex(currentIndex - 1)
    }

    setIsAutoPlaying(autoPlay)
  }

  return (
    <div
      className={`relative overflow-hidden ${borderRadius ? "rounded-xl" : ""}`}
      style={{ height }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(autoPlay)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {dataSource.map((item, index) => (
          <div
            key={index}
            className="flex-none w-full h-full flex items-center justify-center relative"
          >
            <SEOImage
              src={item.image}
              loading={index === 0 ? "eager" : "lazy"}
              width={1600}
              height={1000}
              context="carousel"
              index={index}
              style={{ objectFit: "cover", flex: 1 }}
              className="w-full h-full rounded-xl"
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            {!hideCaption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-xl">
                <h2 className="text-white text-base sm:text-lg font-semibold drop-shadow-lg">
                  {item.name || ""}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {!hideArrows && dataSource.length > 1 && (
        <React.Fragment>
          <button
            onClick={() => updateIndex(currentIndex - 1)}
            className="absolute px-4 left-0 top-1/2 transform -translate-y-1/2 group"
            data-testid="carousel-left-control"
            type="button"
            aria-label="Previous slide"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 text-white sm:h-6 sm:w-6"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </button>
          <button
            onClick={() => updateIndex(currentIndex + 1)}
            className="group px-4 absolute right-0 top-1/2 transform -translate-y-1/2"
            data-testid="carousel-right-control"
            type="button"
            aria-label="Next slide"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 text-white sm:h-6 sm:w-6"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </React.Fragment>
      )}

      {/* Indicators */}
      {!hideIndicators && dataSource.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {dataSource.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => updateIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CarouselOp
