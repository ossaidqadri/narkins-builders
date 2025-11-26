// Adapter to transform database comments to Google Reviews format
import { Comment } from "@/lib/database"

export interface GoogleReviewData {
  author: {
    name: string
    profilePhotoUrl?: string
    isLocalGuide?: boolean
  }
  rating: number
  text: string
  publishTime: string
  relativePublishTimeDescription: string
  reviewId: string
  authorAttribution?: {
    displayName: string
    uri?: string
    photoURI?: string
  }
  // Additional fields for our implementation
  helpfulCount?: number
  isVerified?: boolean
  likeCount?: number
}

export interface GoogleReviewsSummary {
  averageRating: number
  totalReviews: number
  ratingBreakdown: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

/**
 * Transform database comment to Google Reviews format
 */
export function transformCommentToGoogleReview(
  comment: Comment
): GoogleReviewData {
  const createdAt = new Date(comment.created_at)

  return {
    author: {
      name: comment.author_name,
      profilePhotoUrl: generateAvatarUrl(comment.author_name),
      isLocalGuide: comment.is_verified,
    },
    rating: comment.rating,
    text: comment.content,
    publishTime: createdAt.toISOString(),
    relativePublishTimeDescription: getRelativeTime(createdAt),
    reviewId: comment.id.toString(),
    authorAttribution: {
      displayName: comment.author_name,
      photoURI: generateAvatarUrl(comment.author_name),
    },
    helpfulCount: comment.helpful_count,
    isVerified: comment.is_verified,
    likeCount: comment.likes,
  }
}

/**
 * Transform multiple comments to Google Reviews format with summary
 */
export function transformCommentsToGoogleReviews(comments: Comment[]): {
  reviews: GoogleReviewData[]
  summary: GoogleReviewsSummary
} {
  const reviews = comments.map(transformCommentToGoogleReview)
  const summary = generateReviewsSummary(comments)

  return { reviews, summary }
}

/**
 * Generate reviews summary statistics
 */
function generateReviewsSummary(comments: Comment[]): GoogleReviewsSummary {
  if (comments.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0)
  const averageRating = totalRating / comments.length

  const ratingBreakdown = comments.reduce(
    (breakdown, comment) => {
      breakdown[comment.rating as keyof typeof breakdown]++
      return breakdown
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  )

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: comments.length,
    ratingBreakdown,
  }
}

/**
 * Generate relative time description (e.g., "2 weeks ago")
 */
function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInHours = Math.floor(
    (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24)
    return `${days} day${days === 1 ? "" : "s"} ago`
  } else if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7))
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`
  } else if (diffInHours < 24 * 365) {
    const months = Math.floor(diffInHours / (24 * 30))
    return `${months} month${months === 1 ? "" : "s"} ago`
  } else {
    const years = Math.floor(diffInHours / (24 * 365))
    return `${years} year${years === 1 ? "" : "s"} ago`
  }
}

/**
 * Generate avatar URL based on user name (using initials with color)
 */
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Generate consistent color based on name
  const colors = [
    "4F46E5", // Indigo
    "059669", // Emerald
    "DC2626", // Red
    "7C3AED", // Violet
    "EA580C", // Orange
    "0891B2", // Sky
    "BE185D", // Pink
    "16A34A", // Green
  ]

  const colorIndex = name.length % colors.length
  const backgroundColor = colors[colorIndex]

  // Return data URL for colored avatar with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=40&rounded=true&bold=true`
}

/**
 * Sort reviews by Google's typical algorithm (helpful votes, then recency)
 */
export function sortReviewsGoogleStyle(
  reviews: GoogleReviewData[]
): GoogleReviewData[] {
  return [...reviews].sort((a, b) => {
    // First sort by helpful count (descending)
    const helpfulDiff = (b.helpfulCount || 0) - (a.helpfulCount || 0)
    if (helpfulDiff !== 0) return helpfulDiff

    // Then by rating (higher ratings first for similar helpful counts)
    const ratingDiff = b.rating - a.rating
    if (ratingDiff !== 0) return ratingDiff

    // Finally by recency (newer first)
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  })
}

/**
 * Filter reviews by rating
 */
export function filterReviewsByRating(
  reviews: GoogleReviewData[],
  rating: number
): GoogleReviewData[] {
  return reviews.filter((review) => review.rating === rating)
}

/**
 * Get reviews with pagination (Google Reviews style)
 */
export function paginateReviews(
  reviews: GoogleReviewData[],
  page: number = 1,
  limit: number = 10
): {
  reviews: GoogleReviewData[]
  hasMore: boolean
  total: number
} {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedReviews = reviews.slice(startIndex, endIndex)

  return {
    reviews: paginatedReviews,
    hasMore: endIndex < reviews.length,
    total: reviews.length,
  }
}
