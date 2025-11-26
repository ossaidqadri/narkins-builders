// File: src/lib/database.ts
// Database connection handler for MySQL on Hostinger

import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "narkinsbuilders_comments",
  port: parseInt(process.env.DB_PORT || "3306"),
  charset: "utf8mb4",
  timezone: "+00:00",
  acquireTimeout: 60000,
  timeout: 60000,
  // SSL configuration for production
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
}

// Connection pool for better performance
let pool: mysql.Pool

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

// Get database connection
export async function getDBConnection(): Promise<mysql.PoolConnection> {
  try {
    const pool = createPool()
    const connection = await pool.getConnection()
    return connection
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// Execute query with automatic connection management
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  let connection: mysql.PoolConnection | null = null

  try {
    connection = await getDBConnection()
    const [rows] = await connection.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Query execution error:", error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// Execute single query and return first result
export async function executeQuerySingle<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getDBConnection()
    await connection.ping()
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Types for database entities
export interface Comment {
  id: number
  blog_slug: string
  author_name: string
  author_email: string
  content: string
  likes: number
  rating: number // 1-5 stars
  helpful_count: number
  is_verified: boolean
  created_at: Date
  updated_at: Date
  approved: boolean
  auto_approved: boolean
  moderation_score: number
  flagged_reason?: string
  user_ip: string
  user_agent?: string
}

export interface CommentLike {
  id: number
  comment_id: number
  user_ip: string
  user_fingerprint?: string
  created_at: Date
}

export interface CommentHelpfulVote {
  id: number
  comment_id: number
  user_ip: string
  user_fingerprint?: string
  created_at: Date
}

export interface AdminUser {
  id: number
  username: string
  email: string
  password_hash: string
  role: "admin" | "moderator"
  created_at: Date
  last_login?: Date
  active: boolean
}

export interface ModerationLog {
  id: number
  comment_id: number
  admin_id?: number
  action: "approved" | "rejected" | "flagged" | "auto_approved"
  reason?: string
  previous_status?: "pending" | "approved" | "rejected" | "flagged"
  created_at: Date
}

export interface BlogStats {
  id: number
  blog_slug: string
  total_comments: number
  total_likes: number
  avg_moderation_score: number
  last_comment_at?: Date
  last_updated: Date
}

// Database queries
export class CommentQueries {
  // Get all approved comments for a blog
  static async getCommentsBySlug(blogSlug: string): Promise<Comment[]> {
    const query = `
   SELECT * FROM blog_comments 
   WHERE blog_slug = ? AND approved = TRUE 
   ORDER BY created_at DESC
  `
    return executeQuery<Comment>(query, [blogSlug])
  }

  // Create new comment
  static async createComment(
    commentData: Omit<
      Comment,
      "id" | "created_at" | "updated_at" | "likes" | "helpful_count"
    >
  ): Promise<number> {
    const query = `
   INSERT INTO blog_comments 
   (blog_slug, author_name, author_email, content, rating, is_verified, approved, auto_approved, moderation_score, flagged_reason, user_ip, user_agent)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
    const params = [
      commentData.blog_slug,
      commentData.author_name,
      commentData.author_email,
      commentData.content,
      commentData.rating || 5,
      commentData.is_verified || false,
      commentData.approved,
      commentData.auto_approved,
      commentData.moderation_score,
      commentData.flagged_reason,
      commentData.user_ip,
      commentData.user_agent,
    ]

    const result = await executeQuery(query, params)
    return (result as any).insertId
  }

  // Get comment by ID
  static async getCommentById(id: number): Promise<Comment | null> {
    const query = "SELECT * FROM blog_comments WHERE id = ?"
    return executeQuerySingle<Comment>(query, [id])
  }

  // Update comment approval status
  static async updateCommentApproval(
    id: number,
    approved: boolean,
    reason?: string
  ): Promise<void> {
    const query = `
   UPDATE blog_comments 
   SET approved = ?, flagged_reason = ?, updated_at = CURRENT_TIMESTAMP
   WHERE id = ?
  `
    await executeQuery(query, [approved, reason, id])
  }

  // Delete comment
  static async deleteComment(id: number): Promise<void> {
    const query = "DELETE FROM blog_comments WHERE id = ?"
    await executeQuery(query, [id])
  }

  // Get pending comments for moderation
  static async getPendingComments(): Promise<Comment[]> {
    const query = `
   SELECT * FROM blog_comments 
   WHERE approved = FALSE 
   ORDER BY created_at DESC
  `
    return executeQuery<Comment>(query)
  }

  // Get all comments with pagination
  static async getAllComments(
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    const query = `
   SELECT * FROM blog_comments 
   ORDER BY created_at DESC 
   LIMIT ? OFFSET ?
  `
    return executeQuery<Comment>(query, [limit, offset])
  }

  // Get approved comments
  static async getApprovedComments(): Promise<Comment[]> {
    const query = `
   SELECT * FROM blog_comments 
   WHERE approved = TRUE 
   ORDER BY created_at DESC
  `
    return executeQuery<Comment>(query)
  }
}

export class LikeQueries {
  // Toggle like for comment
  static async toggleLike(
    commentId: number,
    userIp: string,
    userFingerprint?: string
  ): Promise<boolean> {
    // Check if like already exists
    const existingLike = await executeQuerySingle(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_ip = ?",
      [commentId, userIp]
    )

    if (existingLike) {
      // Remove like
      await executeQuery(
        "DELETE FROM comment_likes WHERE comment_id = ? AND user_ip = ?",
        [commentId, userIp]
      )
      return false // Like removed
    } else {
      // Add like
      await executeQuery(
        "INSERT INTO comment_likes (comment_id, user_ip, user_fingerprint) VALUES (?, ?, ?)",
        [commentId, userIp, userFingerprint]
      )
      return true // Like added
    }
  }

  // Get like count for comment
  static async getLikeCount(commentId: number): Promise<number> {
    const result = await executeQuerySingle<{ count: number }>(
      "SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?",
      [commentId]
    )
    return result?.count || 0
  }

  // Check if user has liked comment
  static async hasUserLiked(
    commentId: number,
    userIp: string
  ): Promise<boolean> {
    const result = await executeQuerySingle(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_ip = ?",
      [commentId, userIp]
    )
    return !!result
  }
}

export class HelpfulVoteQueries {
  // Toggle helpful vote for comment
  static async toggleHelpfulVote(
    commentId: number,
    userIp: string,
    userFingerprint?: string
  ): Promise<boolean> {
    // Check if vote already exists
    const existingVote = await executeQuerySingle(
      "SELECT id FROM comment_helpful_votes WHERE comment_id = ? AND user_ip = ?",
      [commentId, userIp]
    )

    if (existingVote) {
      // Remove vote
      await executeQuery(
        "DELETE FROM comment_helpful_votes WHERE comment_id = ? AND user_ip = ?",
        [commentId, userIp]
      )
      return false // Vote removed
    } else {
      // Add vote
      await executeQuery(
        "INSERT INTO comment_helpful_votes (comment_id, user_ip, user_fingerprint) VALUES (?, ?, ?)",
        [commentId, userIp, userFingerprint || null]
      )
      return true // Vote added
    }
  }

  // Get helpful vote count for comment
  static async getHelpfulCount(commentId: number): Promise<number> {
    const result = await executeQuerySingle<{ count: number }>(
      "SELECT COUNT(*) as count FROM comment_helpful_votes WHERE comment_id = ?",
      [commentId]
    )
    return result?.count || 0
  }

  // Check if user has voted helpful
  static async hasUserVotedHelpful(
    commentId: number,
    userIp: string
  ): Promise<boolean> {
    const result = await executeQuerySingle(
      "SELECT id FROM comment_helpful_votes WHERE comment_id = ? AND user_ip = ?",
      [commentId, userIp]
    )
    return !!result
  }
}

export class StatsQueries {
  // Get blog stats
  static async getBlogStats(blogSlug: string): Promise<BlogStats | null> {
    const query = "SELECT * FROM blog_stats WHERE blog_slug = ?"
    return executeQuerySingle<BlogStats>(query, [blogSlug])
  }

  // Get all blog stats
  static async getAllBlogStats(): Promise<BlogStats[]> {
    const query =
      "SELECT * FROM blog_stats ORDER BY total_comments DESC, total_likes DESC"
    return executeQuery<BlogStats>(query)
  }
}

// Initialize database (run once)
export async function initializeDatabase(): Promise<void> {
  try {
    const connection = await getDBConnection()

    // Test connection
    await connection.ping()

    // Verify tables exist
    const tables = await executeQuery("SHOW TABLES")

    connection.release()
  } catch (error) {
    console.error("ERROR: Database initialization failed:", error)
    throw error
  }
}

// Close database connections (for cleanup)
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end()
  }
}
