// API endpoint: GET /api/comments/stats/[slug] - Get comment statistics for a blog post

import { NextApiRequest, NextApiResponse } from "next"
import { executeQuerySingle, StatsQueries } from "../../../../lib/database"

interface StatsResponse {
  success: boolean
  stats: {
    totalComments: number
    totalLikes: number
    avgModerationScore: number
    lastCommentAt: string | null
    hasUserCommented?: boolean
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({
      success: false,
      stats: {
        totalComments: 0,
        totalLikes: 0,
        avgModerationScore: 0,
        lastCommentAt: null,
      },
    })
  }

  const { slug } = req.query

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      success: false,
      stats: {
        totalComments: 0,
        totalLikes: 0,
        avgModerationScore: 0,
        lastCommentAt: null,
      },
    })
  }

  try {
    // Get stats from database
    let blogStats = await StatsQueries.getBlogStats(slug)

    // If no stats exist, calculate them from comments
    if (!blogStats) {
      const commentStats = await executeQuerySingle<{
        total_comments: number
        total_likes: number
        avg_score: number
        last_comment: Date
      }>(
        `
    SELECT 
     COUNT(*) as total_comments,
     COALESCE(SUM(likes), 0) as total_likes,
     COALESCE(AVG(moderation_score), 0) as avg_score,
     MAX(created_at) as last_comment
    FROM blog_comments 
    WHERE blog_slug = ? AND approved = TRUE
   `,
        [slug]
      )

      if (commentStats) {
        blogStats = {
          id: 0,
          blog_slug: slug,
          total_comments: commentStats.total_comments,
          total_likes: commentStats.total_likes,
          avg_moderation_score: commentStats.avg_score,
          last_comment_at: commentStats.last_comment,
          last_updated: new Date(),
        }
      }
    }

    // Check if current user has commented (optional feature)
    const userIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.headers["x-real-ip"]?.toString() ||
      req.connection?.remoteAddress ||
      "127.0.0.1"

    const userComment = await executeQuerySingle(
      "SELECT id FROM blog_comments WHERE blog_slug = ? AND user_ip = ? AND approved = TRUE LIMIT 1",
      [slug, userIp]
    )

    const stats = {
      totalComments: blogStats?.total_comments || 0,
      totalLikes: blogStats?.total_likes || 0,
      avgModerationScore: blogStats?.avg_moderation_score || 0,
      lastCommentAt: blogStats?.last_comment_at?.toISOString() || null,
      hasUserCommented: !!userComment,
    }

    return res.status(200).json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Get comment stats error:", error)
    return res.status(500).json({
      success: false,
      stats: {
        totalComments: 0,
        totalLikes: 0,
        avgModerationScore: 0,
        lastCommentAt: null,
      },
    })
  }
}
