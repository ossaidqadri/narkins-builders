"use client"

import React from "react"
import { ChevronDown, SlidersHorizontal, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GoogleReviewsSortProps {
  sortBy: "helpful" | "newest" | "oldest" | "rating"
  onSortChange: (sort: "helpful" | "newest" | "oldest" | "rating") => void
  totalReviews: number
  filterRating?: number | null
  onClearFilter?: () => void
  className?: string
}

export function GoogleReviewsSort({
  sortBy,
  onSortChange,
  totalReviews,
  filterRating,
  onClearFilter,
  className,
}: GoogleReviewsSortProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const sortOptions = [
    { value: "helpful" as const, label: "Most helpful" },
    { value: "newest" as const, label: "Newest first" },
    { value: "oldest" as const, label: "Oldest first" },
    { value: "rating" as const, label: "Highest rated" },
  ]

  const currentSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    "Most helpful"

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Results Count and Filter Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span>
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            {filterRating && (
              <>
                {" "}
                •{" "}
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 inline" />
                {filterRating} stars only
              </>
            )}
          </span>
        </div>

        {/* Clear Filter Button */}
        {filterRating && onClearFilter && (
          <button
            onClick={onClearFilter}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>Clear filter</span>
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>Sort: {currentSortLabel}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm transition-colors",
                      sortBy === option.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <div className="float-right">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GoogleReviewsSort
