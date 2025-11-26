"use client"

import React, { useState } from "react"
import { Button } from "@/components/common/ui/button"
import { Send, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface GoogleReviewFormProps {
  blogSlug: string
  onReviewSubmitted: (review: { id: number; pending: boolean }) => void
  className?: string
}

export function GoogleReviewForm({
  blogSlug,
  onReviewSubmitted,
  className,
}: GoogleReviewFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      setError("Please select a rating")
      return
    }

    if (!authorName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!authorEmail.trim()) {
      setError("Please enter your email")
      return
    }

    if (!content.trim()) {
      setError("Please write a review")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_slug: blogSlug,
          author_name: authorName.trim(),
          author_email: authorEmail.trim(),
          content: content.trim(),
          rating: rating,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Reset form
        setRating(0)
        setHoverRating(0)
        setAuthorName("")
        setAuthorEmail("")
        setContent("")
        setIsExpanded(false)

        // Notify parent
        onReviewSubmitted({
          id: data.commentId,
          pending: !data.autoApproved,
        })
      } else {
        setError(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Review submission error:", error)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsExpanded(false)
    setRating(0)
    setHoverRating(0)
    setAuthorName("")
    setAuthorEmail("")
    setContent("")
    setError("")
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      return (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
          className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
        >
          <Star
            className={cn(
              "h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 transition-colors duration-200",
              (hoverRating || rating) >= starValue
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 hover:text-amber-300"
            )}
          />
        </button>
      )
    })
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Terrible"
      case 2:
        return "Poor"
      case 3:
        return "Average"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return ""
    }
  }

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {!isExpanded ? (
        /* Collapsed State - Click to Expand */
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors duration-200 group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors flex-shrink-0">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1 text-base sm:text-lg">
                Write a review
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Share your experience about this article
              </p>
            </div>
            <div className="ml-auto flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
              ))}
            </div>
          </div>
        </motion.button>
      ) : (
        /* Expanded State - Full Form */
        <motion.div
          initial={{ height: "auto", opacity: 1 }}
          animate={{ height: "auto", opacity: 1 }}
          className="p-4 sm:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-base sm:text-lg">
                  Write a review
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Share your thoughts about this article
                </p>
              </div>
            </div>

            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Your rating *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars()}</div>
                <AnimatePresence>
                  {(rating > 0 || hoverRating > 0) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium text-gray-700"
                    >
                      {getRatingText(hoverRating || rating)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Name and Email */}
            <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-1 lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your name *
                </label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base sm:text-sm"
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="authorEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your email *
                </label>
                <input
                  type="email"
                  id="authorEmail"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base sm:text-sm"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your review *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-base sm:text-sm"
                placeholder="Share your experience about this article..."
                disabled={isSubmitting}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">
                  {content.length}/500
                </span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 lg:pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 lg:px-8 lg:py-3 min-h-[44px] w-full sm:w-auto lg:text-base"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !rating ||
                  !authorName.trim() ||
                  !authorEmail.trim() ||
                  !content.trim()
                }
                className="px-6 py-3 lg:px-8 lg:py-3 bg-blue-600 hover:bg-blue-700 min-h-[44px] w-full sm:w-auto lg:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>Submit review</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  )
}

export default GoogleReviewForm
