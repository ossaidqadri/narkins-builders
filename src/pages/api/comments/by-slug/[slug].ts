// API endpoint: GET /api/comments/by-slug/[slug] - Get comments for a blog post
// API endpoint: POST /api/comments/by-slug/[slug] - Create new comment

import { NextApiRequest, NextApiResponse } from "next"
import { Comment, CommentQueries } from "../../../../lib/database"
import { createCommentSchema, validateInput } from "../../../../lib/validation"
import { verifyRecaptcha } from "../../../../lib/recaptcha"
import { checkRateLimit, getClientIP } from "../../../../lib/rate-limit"

interface CreateCommentResponse {
  success: boolean
  message: string
  comment?: {
    id: number
    pending: boolean
  }
  rateLimitInfo?: {
    remaining: number
    resetTime: string
  }
}

interface GetCommentsResponse {
  success: boolean
  comments: Comment[]
  total: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCommentResponse | GetCommentsResponse>
) {
  const { slug } = req.query

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid blog slug",
    })
  }

  if (req.method === "GET") {
    return handleGetComments(req, res, slug)
  } else if (req.method === "POST") {
    return handleCreateComment(req, res, slug)
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }
}

// Get approved comments for a blog post
async function handleGetComments(
  req: NextApiRequest,
  res: NextApiResponse<GetCommentsResponse>,
  slug: string
) {
  try {
    const comments = await CommentQueries.getCommentsBySlug(slug)

    return res.status(200).json({
      success: true,
      comments,
      total: comments.length,
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return res.status(500).json({
      success: false,
      comments: [],
      total: 0,
    })
  }
}

// Create new comment
async function handleCreateComment(
  req: NextApiRequest,
  res: NextApiResponse<CreateCommentResponse>,
  slug: string
) {
  try {
    const userIp = getClientIP(req)
    const userAgent = req.headers["user-agent"] || ""

    // Rate limiting check
    const rateLimit = await checkRateLimit(userIp, "comment")
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: "Too many comments. Please try again later.",
        rateLimitInfo: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime.toISOString(),
        },
      })
    }

    // Validate input
    const validation = validateInput(createCommentSchema, {
      ...req.body,
      blogSlug: slug,
    })

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      })
    }

    const { authorName, authorEmail, content, recaptchaToken } = validation.data

    // Verify ReCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaValid) {
      return res.status(400).json({
        success: false,
        message: "ReCAPTCHA verification failed",
      })
    }

    // Simple content moderation (basic checks)
    const moderationScore = calculateModerationScore(content)
    const autoApproveThreshold = parseFloat(
      process.env.AUTO_APPROVE_THRESHOLD || "0.8"
    )
    const autoApprove =
      process.env.AUTO_APPROVE_COMMENTS === "true" &&
      moderationScore >= autoApproveThreshold

    // Create comment
    const commentData = {
      blog_slug: slug,
      author_name: authorName,
      author_email: authorEmail && authorEmail.trim() ? authorEmail : "",
      content: content,
      rating: 5, // Default rating for legacy API
      is_verified: false,
      approved: autoApprove,
      auto_approved: autoApprove,
      moderation_score: moderationScore,
      flagged_reason: moderationScore < 0.3 ? "Low moderation score" : null,
      user_ip: userIp,
      user_agent: userAgent || null,
    }

    const commentId = await CommentQueries.createComment(commentData)

    return res.status(201).json({
      success: true,
      message: autoApprove
        ? "Comment posted successfully"
        : "Comment submitted for moderation",
      comment: {
        id: commentId,
        pending: !autoApprove,
      },
      rateLimitInfo: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime.toISOString(),
      },
    })
  } catch (error) {
    console.error("Create comment error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
    })
  }
}

// Simple moderation scoring (0-1, higher is better)
function calculateModerationScore(content: string): number {
  let score = 1.0

  // Basic spam/offensive content detection
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "click here",
    "free money",
  ]
  const offensiveKeywords = ["spam", "scam", "hate", "stupid", "idiot"]

  const lowerContent = content.toLowerCase()

  // Check for spam keywords
  spamKeywords.forEach((keyword) => {
    if (lowerContent.includes(keyword)) {
      score -= 0.3
    }
  })

  // Check for offensive content
  offensiveKeywords.forEach((keyword) => {
    if (lowerContent.includes(keyword)) {
      score -= 0.2
    }
  })

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
  if (capsRatio > 0.5) {
    score -= 0.2
  }

  // Check for excessive punctuation
  const punctuationRatio = (content.match(/[!?]{2,}/g) || []).length
  if (punctuationRatio > 2) {
    score -= 0.1
  }

  // Check content length (very short might be spam)
  if (content.trim().length < 10) {
    score -= 0.3
  }

  return Math.max(0, Math.min(1, score))
}
