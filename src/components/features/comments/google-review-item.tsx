"use client"

import React, { useState } from "react"
import { GoogleReviewData } from "@/lib/google-reviews-adapter"
import {
  Heart,
  MoreHorizontal,
  Shield,
  Star,
  ThumbsUp,
  Verified,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"
import { UserAvatar } from "./user-avatar"

interface GoogleReviewItemProps {
  review: GoogleReviewData
  onHelpfulVote: (reviewId: string, currentlyVoted: boolean) => void
  onLike: (reviewId: string) => void
  index?: number
}

export function GoogleReviewItem({
  review,
  onHelpfulVote,
  onLike,
  index = 0,
}: GoogleReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVotingHelpful, setIsVotingHelpful] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const shouldTruncate = review.text.length > 200
  const displayText =
    shouldTruncate && !isExpanded
      ? `${review.text.substring(0, 200)}...`
      : review.text

  const handleHelpfulClick = async () => {
    if (isVotingHelpful) return

    setIsVotingHelpful(true)
    try {
      await onHelpfulVote(review.reviewId, hasVotedHelpful)
      setHasVotedHelpful(!hasVotedHelpful)
    } catch (error) {
      console.error("Error voting helpful:", error)
    } finally {
      setIsVotingHelpful(false)
    }
  }

  const handleLikeClick = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      await onLike(review.reviewId)
      setHasLiked(!hasLiked)
    } catch (error) {
      console.error("Error liking review:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5",
          i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
        )}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.2),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 w-full max-w-full overflow-hidden"
    >
      <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
            {review.author.profilePhotoUrl && !imageError ? (
              <Image
                src={review.author.profilePhotoUrl}
                alt={review.author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <UserAvatar
                name={review.author.name}
                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
              />
            )}
            {Boolean(review.isVerified) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <Verified className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-2 min-w-0">
                <h4 className="font-medium text-gray-900 text-base sm:text-lg truncate">
                  {review.author.name}
                </h4>
                {Boolean(review.author.isLocalGuide) && (
                  <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-50 rounded-full">
                    <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium hidden sm:inline">
                      Local Guide
                    </span>
                    <span className="text-xs text-blue-600 font-medium sm:hidden">
                      Guide
                    </span>
                  </div>
                )}
              </div>

              {/* Rating and Date */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm sm:text-base text-gray-500">
                  {review.relativePublishTimeDescription}
                </span>
              </div>
            </div>

            {/* More options */}
            <button
              className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 lg:hover:bg-gray-50 transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              title="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>

          {/* Review Content */}
          <div className="mb-4 sm:mb-5 lg:mb-6 w-full max-w-full">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-base break-words overflow-hidden">
              {displayText}
            </p>

            {Boolean(shouldTruncate) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium mt-2 min-h-[44px] flex items-center -ml-1 px-1 transition-all duration-200 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 sm:pt-3 lg:pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Helpful Button */}
              <button
                onClick={handleHelpfulClick}
                disabled={isVotingHelpful}
                title={
                  hasVotedHelpful ? "Remove helpful vote" : "Mark as helpful"
                }
                className={cn(
                  "flex items-center gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2 rounded-full text-xs sm:text-sm lg:text-sm font-medium transition-all duration-200 min-h-[36px] sm:min-h-[44px] lg:min-h-[40px] group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  hasVotedHelpful
                    ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                    : "text-gray-600 hover:bg-gray-50 border border-gray-300 hover:border-gray-400",
                  isVotingHelpful && "opacity-50 cursor-not-allowed"
                )}
              >
                <ThumbsUp
                  className={cn(
                    "h-3.5 w-3.5",
                    hasVotedHelpful && "fill-current"
                  )}
                />
                <span>Helpful</span>
                {(review.helpfulCount || 0) > 0 && (
                  <span className="ml-1">({review.helpfulCount})</span>
                )}
              </button>

              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                disabled={isLiking}
                title={hasLiked ? "Unlike this review" : "Like this review"}
                className={cn(
                  "flex items-center gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2 rounded-full text-xs sm:text-sm lg:text-sm font-medium transition-all duration-200 min-h-[36px] sm:min-h-[44px] lg:min-h-[40px] group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
                  hasLiked
                    ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    : "text-gray-600 hover:bg-gray-50 border border-gray-300 hover:border-gray-400",
                  isLiking && "opacity-50 cursor-not-allowed"
                )}
              >
                <Heart
                  className={cn("h-3.5 w-3.5", hasLiked && "fill-current")}
                />
                {(review.likeCount || 0) > 0 && <span>{review.likeCount}</span>}
              </button>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full self-start sm:self-center">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-gray-700">
                {review.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GoogleReviewItem
