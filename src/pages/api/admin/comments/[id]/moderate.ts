// API endpoint: PUT /api/admin/comments/[id]/moderate - Approve/reject comment

import { NextApiResponse } from "next"
import {
  AuthenticatedRequest,
  withAuth,
} from "../../../../../lib/auth-middleware"
import {
  moderateCommentSchema,
  validateInput,
} from "../../../../../lib/validation"
import { CommentQueries, executeQuery } from "../../../../../lib/database"

interface ModerateResponse {
  success: boolean
  message: string
  comment?: {
    id: number
    approved: boolean
  }
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ModerateResponse>
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  const { id } = req.query
  const commentId = parseInt(id as string)

  if (!commentId || isNaN(commentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment ID",
    })
  }

  try {
    // Validate input
    const validation = validateInput(moderateCommentSchema, req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      })
    }

    const { approved, reason } = validation.data

    // Get current comment to check if it exists
    const comment = await CommentQueries.getCommentById(commentId)
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      })
    }

    const previousStatus = comment.approved ? "approved" : "pending"

    // Update comment approval status
    await CommentQueries.updateCommentApproval(commentId, approved, reason)

    // Log moderation action
    await executeQuery(
      `
   INSERT INTO moderation_log (comment_id, admin_id, action, reason, previous_status)
   VALUES (?, ?, ?, ?, ?)
  `,
      [
        commentId,
        req.user.userId,
        approved ? "approved" : "rejected",
        reason || null,
        previousStatus,
      ]
    )

    console.log(
      `Comment ${commentId} ${approved ? "approved" : "rejected"} by ${req.user.username}`
    )

    return res.status(200).json({
      success: true,
      message: `Comment ${approved ? "approved" : "rejected"} successfully`,
      comment: {
        id: commentId,
        approved,
      },
    })
  } catch (error) {
    console.error("Moderate comment error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to moderate comment",
    })
  }
}

export default withAuth(handler, "moderator")
