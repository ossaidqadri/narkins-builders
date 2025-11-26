// Main API endpoint for comments
// GET /api/comments - Get all comments (admin)
// POST /api/comments - Create new comment

import { NextApiRequest, NextApiResponse } from "next"
import { CommentQueries } from "@/lib/database"
import { checkRateLimit } from "@/lib/rate-limit"
import { validateComment } from "@/lib/validation"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    case "POST":
      return handlePost(req, res)
    default:
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      })
  }
}

// GET /api/comments - Get all comments (admin only)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const comments = await CommentQueries.getAllComments()
    return res.status(200).json({
      success: true,
      comments,
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

// POST /api/comments - Create new comment
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      blog_slug,
      author_name,
      author_email,
      content,
      rating = 5,
    } = req.body

    // Validate required fields
    if (!blog_slug || !author_name || !author_email || !content) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      })
    }

    // Get user IP
    const userIp =
      (req.headers["x-forwarded-for"] as string) ||
      (req.headers["x-real-ip"] as string) ||
      req.connection.remoteAddress ||
      "127.0.0.1"

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(userIp, "comment")
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: "Too many comments. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      })
    }

    // Validate comment content
    const validation = await validateComment({
      author_name: author_name.trim(),
      author_email: author_email.trim(),
      content: content.trim(),
      user_ip: userIp,
    })

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.reason,
      })
    }

    // Create comment data
    const commentData = {
      blog_slug: blog_slug.trim(),
      author_name: author_name.trim(),
      author_email: author_email.trim().toLowerCase(),
      content: content.trim(),
      rating: parseInt(rating.toString()),
      is_verified: false,
      approved: validation.autoApproved,
      auto_approved: validation.autoApproved,
      moderation_score: validation.score,
      flagged_reason: validation.autoApproved ? null : validation.reason,
      user_ip: userIp,
      user_agent: req.headers["user-agent"] || null,
    }

    // Create comment
    const commentId = await CommentQueries.createComment(commentData)

    return res.status(201).json({
      success: true,
      commentId,
      autoApproved: validation.autoApproved,
      message: validation.autoApproved
        ? "Review submitted successfully!"
        : "Review submitted and is pending moderation.",
    })
  } catch (error) {
    console.error("Create comment error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to submit review. Please try again.",
    })
  }
}
