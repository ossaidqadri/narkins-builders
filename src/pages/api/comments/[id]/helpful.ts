// API endpoint for toggling helpful votes on comments
// POST /api/comments/[id]/helpful

import { NextApiRequest, NextApiResponse } from "next"
import { CommentQueries, HelpfulVoteQueries } from "@/lib/database"
import { checkRateLimit } from "@/lib/rate-limit"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    })
  }

  try {
    const { id } = req.query
    const commentId = parseInt(id as string)

    if (!commentId || isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid comment ID",
      })
    }

    // Get user IP
    const userIp =
      (req.headers["x-forwarded-for"] as string) ||
      (req.headers["x-real-ip"] as string) ||
      req.connection.remoteAddress ||
      "127.0.0.1"

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(userIp, "like") // Reuse like rate limit
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      })
    }

    // Verify comment exists and is approved
    const comment = await CommentQueries.getCommentById(commentId)
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      })
    }

    if (!comment.approved) {
      return res.status(403).json({
        success: false,
        error: "Comment not approved",
      })
    }

    // Toggle helpful vote
    const userFingerprint = req.headers["x-user-fingerprint"] as string
    const voted = await HelpfulVoteQueries.toggleHelpfulVote(
      commentId,
      userIp,
      userFingerprint
    )

    // Get updated count
    const helpfulCount = await HelpfulVoteQueries.getHelpfulCount(commentId)

    return res.status(200).json({
      success: true,
      voted,
      helpfulCount,
      message: voted ? "Vote added" : "Vote removed",
    })
  } catch (error) {
    console.error("Helpful vote error:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
