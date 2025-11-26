// API endpoint: DELETE /api/admin/comments/[id]/delete - Delete comment

import { NextApiResponse } from "next"
import {
  AuthenticatedRequest,
  withAuth,
} from "../../../../../lib/auth-middleware"
import { CommentQueries, executeQuery } from "../../../../../lib/database"

interface DeleteResponse {
  success: boolean
  message: string
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<DeleteResponse>
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
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
    // Check if comment exists
    const comment = await CommentQueries.getCommentById(commentId)
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      })
    }

    // Only admins can delete comments, or moderators can delete their own moderated comments
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete comments",
      })
    }

    // Log deletion action before deleting
    await executeQuery(
      `
   INSERT INTO moderation_log (comment_id, admin_id, action, reason, previous_status)
   VALUES (?, ?, 'deleted', 'Comment deleted by admin', ?)
  `,
      [commentId, req.user.userId, comment.approved ? "approved" : "pending"]
    )

    // Delete comment (CASCADE will handle related likes and logs)
    await CommentQueries.deleteComment(commentId)

    console.log(`Comment ${commentId} deleted by admin ${req.user.username}`)

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Delete comment error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    })
  }
}

export default withAuth(handler, "admin")
