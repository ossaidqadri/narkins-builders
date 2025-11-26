"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Comment } from "@/lib/database"
import {
  GoogleReviewData,
  GoogleReviewsSummary,
  sortReviewsGoogleStyle,
  transformCommentsToGoogleReviews,
} from "@/lib/google-reviews-adapter"
import { GoogleReviewItem } from "./google-review-item"
import { GoogleReviewForm } from "./google-review-form"
import { GoogleReviewsSummaryCard } from "./google-reviews-summary"
import { GoogleReviewsSort } from "./google-reviews-sort"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface GoogleReviewsSectionProps {
  blogSlug: string
  initialComments?: Comment[]
  className?: string
}

export function GoogleReviewsSection({
  blogSlug,
  initialComments = [],
  className,
}: GoogleReviewsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [reviews, setReviews] = useState<GoogleReviewData[]>([])
  const [summary, setSummary] = useState<GoogleReviewsSummary>({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [sortBy, setSortBy] = useState<
    "helpful" | "newest" | "oldest" | "rating"
  >("helpful")
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Transform comments to Google Reviews format
  useEffect(() => {
    const { reviews: transformedReviews, summary: reviewsSummary } =
      transformCommentsToGoogleReviews(comments)

    let sortedReviews = [...transformedReviews]

    // Apply sorting
    switch (sortBy) {
      case "helpful":
        sortedReviews = sortReviewsGoogleStyle(sortedReviews)
        break
      case "newest":
        sortedReviews.sort(
          (a, b) =>
            new Date(b.publishTime).getTime() -
            new Date(a.publishTime).getTime()
        )
        break
      case "oldest":
        sortedReviews.sort(
          (a, b) =>
            new Date(a.publishTime).getTime() -
            new Date(b.publishTime).getTime()
        )
        break
      case "rating":
        sortedReviews.sort((a, b) => b.rating - a.rating)
        break
    }

    // Apply rating filter
    if (filterRating) {
      sortedReviews = sortedReviews.filter(
        (review) => review.rating === filterRating
      )
    }

    setReviews(sortedReviews)
    setSummary(reviewsSummary)
  }, [comments, sortBy, filterRating])

  // Fetch comments from API
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments/by-slug/${blogSlug}`)
      const data = await response.json()

      if (data.success) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }, [blogSlug])

  // Handle new review submission
  const handleReviewSubmitted = (comment: { id: number; pending: boolean }) => {
    setRefreshTrigger((prev) => prev + 1)
    fetchComments() // Refresh the list
  }

  // Handle helpful vote
  const handleHelpfulVote = async (
    reviewId: string,
    currentlyVoted: boolean
  ) => {
    try {
      const response = await fetch(`/api/comments/${reviewId}/helpful`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parseInt(reviewId)
              ? { ...comment, helpful_count: data.helpfulCount }
              : comment
          )
        )
      }
    } catch (error) {
      console.error("Helpful vote error:", error)
    }
  }

  // Handle like
  const handleLike = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/comments/${reviewId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parseInt(reviewId)
              ? { ...comment, likes: data.likeCount }
              : comment
          )
        )
      }
    } catch (error) {
      console.error("Like error:", error)
    }
  }

  // Load comments on mount
  useEffect(() => {
    fetchComments()
  }, [blogSlug, fetchComments])

  // Load comments when refresh is triggered
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchComments()
    }
  }, [refreshTrigger])

  return (
    <div className={cn("max-w-4xl mx-auto px-4 sm:px-6 lg:px-0", className)}>
      {/* Header with Summary */}
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
              Reviews
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Share your experience about this article
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <GoogleReviewsSummaryCard
          summary={summary}
          onRatingFilter={setFilterRating}
          activeFilter={filterRating}
        />
      </div>

      {/* Review Form */}
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <GoogleReviewForm
          blogSlug={blogSlug}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      {/* Sort and Filter Controls */}
      {reviews.length > 0 && (
        <div className="mb-8 lg:mb-10">
          <GoogleReviewsSort
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalReviews={filterRating ? reviews.length : summary.totalReviews}
            filterRating={filterRating}
            onClearFilter={() => setFilterRating(null)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-16 sm:py-12">
            <Star className="h-16 w-16 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-6 sm:mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterRating
                ? `No ${filterRating}-star reviews yet`
                : "No reviews yet"}
            </h3>
            <p className="text-gray-600">
              {filterRating
                ? `Be the first to leave a ${filterRating}-star review!`
                : "Be the first to share your thoughts about this article."}
            </p>
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Show all reviews
              </button>
            )}
          </div>
        ) : (
          reviews.map((review, index) => (
            <GoogleReviewItem
              key={review.reviewId}
              review={review}
              onHelpfulVote={handleHelpfulVote}
              onLike={handleLike}
              index={index}
            />
          ))
        )}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {reviews.length >= 10 && (
        <div className="text-center mt-6 sm:mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
            Load more reviews
          </button>
        </div>
      )}
    </div>
  )
}

export default GoogleReviewsSection
