// API endpoint: POST /api/comments/[id]/like - Toggle like on a comment

import { NextApiRequest, NextApiResponse } from "next"
import { LikeQueries } from "../../../../lib/database"
import { checkRateLimit, getClientIP } from "../../../../lib/rate-limit"

interface LikeResponse {
  success: boolean
  message: string
  liked: boolean
  likeCount: number
  rateLimitInfo?: {
    remaining: number
    resetTime: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LikeResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      liked: false,
      likeCount: 0,
    })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)

  if (!commentId || isNaN(commentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment ID",
      liked: false,
      likeCount: 0,
    })
  }

  try {
    const userIp = getClientIP(req)

    // Rate limiting check for likes
    const rateLimit = await checkRateLimit(userIp, "like")
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: "Too many likes. Please try again later.",
        liked: false,
        likeCount: 0,
        rateLimitInfo: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime.toISOString(),
        },
      })
    }

    // Generate simple user fingerprint (optional)
    const userAgent = req.headers["user-agent"] || ""
    const userFingerprint = Buffer.from(`${userIp}-${userAgent}`)
      .toString("base64")
      .slice(0, 32)

    // Toggle like
    const liked = await LikeQueries.toggleLike(
      commentId,
      userIp,
      userFingerprint
    )

    // Get updated like count
    const likeCount = await LikeQueries.getLikeCount(commentId)

    return res.status(200).json({
      success: true,
      message: liked ? "Comment liked" : "Like removed",
      liked,
      likeCount,
      rateLimitInfo: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime.toISOString(),
      },
    })
  } catch (error) {
    console.error("Like comment error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to process like",
      liked: false,
      likeCount: 0,
    })
  }
}
