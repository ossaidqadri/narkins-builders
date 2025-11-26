"use client"

import React from "react"
import { GoogleReviewsSummary } from "@/lib/google-reviews-adapter"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GoogleReviewsSummaryCardProps {
  summary: GoogleReviewsSummary
  onRatingFilter?: (rating: number | null) => void
  activeFilter?: number | null
  className?: string
}

export function GoogleReviewsSummaryCard({
  summary,
  onRatingFilter,
  activeFilter,
  className,
}: GoogleReviewsSummaryCardProps) {
  const renderOverallStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return (
          <Star
            key={i}
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-400 fill-amber-400"
          />
        )
      } else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className="relative">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-300" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-400 fill-amber-400" />
            </div>
          </div>
        )
      } else {
        return (
          <Star
            key={i}
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-300"
          />
        )
      }
    })
  }

  const getProgressWidth = (count: number) => {
    return summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0
  }

  const handleRatingClick = (rating: number) => {
    if (onRatingFilter) {
      onRatingFilter(activeFilter === rating ? null : rating)
    }
  }

  if (summary.totalReviews === 0) {
    return (
      <div
        className={cn(
          "bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200",
          className
        )}
      >
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Be the first to review this article!
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
        {/* Overall Rating */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6 text-center lg:text-left">
          <div className="flex-shrink-0">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center lg:justify-start mb-1 sm:mb-2 gap-0.5">
              {renderOverallStars(summary.averageRating)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Based on {summary.totalReviews} review
              {summary.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              summary.ratingBreakdown[
                rating as keyof typeof summary.ratingBreakdown
              ]
            const percentage = getProgressWidth(count)
            const isActive = activeFilter === rating

            return (
              <motion.button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 lg:gap-4 p-1.5 sm:p-2 lg:p-2.5 rounded-md transition-all duration-200 group min-h-[36px] sm:min-h-[40px] lg:min-h-[42px]",
                  isActive
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50",
                  onRatingFilter ? "cursor-pointer" : "cursor-default"
                )}
                whileHover={onRatingFilter ? { scale: 1.01 } : {}}
                whileTap={onRatingFilter ? { scale: 0.99 } : {}}
                disabled={!onRatingFilter}
              >
                <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                  <span className="text-xs sm:text-sm lg:text-sm font-medium text-gray-700">
                    {rating}
                  </span>
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-amber-400 fill-amber-400" />
                </div>

                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2 lg:h-2.5">
                    <motion.div
                      className={cn(
                        "h-2 sm:h-2 lg:h-2.5 rounded-full transition-colors duration-200",
                        isActive ? "bg-blue-500" : "bg-amber-400"
                      )}
                      style={{ width: `${percentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.6,
                        delay: rating * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-xs sm:text-sm lg:text-sm text-gray-600">
                    {count}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {activeFilter && onRatingFilter && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Showing {activeFilter}-star reviews only</span>
            </div>
            <button
              onClick={() => onRatingFilter(null)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filter
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default GoogleReviewsSummaryCard
