// API endpoint: GET /api/admin/comments - Get comments for moderation

import { NextApiResponse } from "next"
import { AuthenticatedRequest, withAuth } from "../../../../lib/auth-middleware"
import { Comment, CommentQueries } from "../../../../lib/database"

interface ModerationResponse {
  success: boolean
  comments: Comment[]
  total: number
  pending: number
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ModerationResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({
      success: false,
      comments: [],
      total: 0,
      pending: 0,
    })
  }

  try {
    const { status = "pending", limit = "50", offset = "0" } = req.query

    let comments: Comment[] = []

    if (status === "pending") {
      comments = await CommentQueries.getPendingComments()
    } else if (status === "all") {
      // Get all comments with pagination
      const limitNum = parseInt(limit as string)
      const offsetNum = parseInt(offset as string)

      comments = await CommentQueries.getAllComments(limitNum, offsetNum)
    } else if (status === "approved") {
      comments = await CommentQueries.getApprovedComments()
    }

    // Get pending count
    const pendingComments = await CommentQueries.getPendingComments()

    return res.status(200).json({
      success: true,
      comments,
      total: comments.length,
      pending: pendingComments.length,
    })
  } catch (error) {
    console.error("Get admin comments error:", error)
    return res.status(500).json({
      success: false,
      comments: [],
      total: 0,
      pending: 0,
    })
  }
}

export default withAuth(handler, "moderator")
