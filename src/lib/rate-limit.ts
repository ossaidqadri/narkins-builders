// Rate limiting utility for comment system

import { executeQuery, executeQuerySingle } from "./database"

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  retryAfter?: number // seconds until retry
}

export async function checkRateLimit(
  userIp: string,
  actionType: "comment" | "like",
  limit?: number,
  windowMs?: number
): Promise<RateLimitResult> {
  // Default limits from env or fallback
  const defaultLimit =
    actionType === "comment"
      ? parseInt(process.env.RATE_LIMIT_COMMENTS || "5")
      : parseInt(process.env.RATE_LIMIT_LIKES || "20")

  const defaultWindow = parseInt(process.env.RATE_LIMIT_WINDOW || "3600") * 1000 // Convert to ms

  const maxRequests = limit || defaultLimit
  const windowSize = windowMs || defaultWindow

  const now = new Date()
  const windowStart = new Date(now.getTime() - windowSize)

  try {
    // Clean up old rate limit records
    await executeQuery(
      "DELETE FROM rate_limits WHERE window_start < ? AND action_type = ?",
      [windowStart, actionType]
    )

    // Get current rate limit record
    const currentLimit = await executeQuerySingle<{
      request_count: number
      window_start: Date
    }>(
      "SELECT request_count, window_start FROM rate_limits WHERE user_ip = ? AND action_type = ?",
      [userIp, actionType]
    )

    if (!currentLimit) {
      // First request in window
      await executeQuery(
        "INSERT INTO rate_limits (user_ip, action_type, request_count, window_start) VALUES (?, ?, 1, ?)",
        [userIp, actionType, now]
      )

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: new Date(now.getTime() + windowSize),
      }
    }

    // Check if current window is still valid
    const windowAge =
      now.getTime() - new Date(currentLimit.window_start).getTime()

    if (windowAge > windowSize) {
      // Reset window
      await executeQuery(
        "UPDATE rate_limits SET request_count = 1, window_start = ? WHERE user_ip = ? AND action_type = ?",
        [now, userIp, actionType]
      )

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: new Date(now.getTime() + windowSize),
      }
    }

    // Check if limit exceeded
    if (currentLimit.request_count >= maxRequests) {
      const resetTime = new Date(
        new Date(currentLimit.window_start).getTime() + windowSize
      )
      const retryAfterMs = resetTime.getTime() - now.getTime()
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil(retryAfterMs / 1000),
      }
    }

    // Increment counter
    await executeQuery(
      "UPDATE rate_limits SET request_count = request_count + 1 WHERE user_ip = ? AND action_type = ?",
      [userIp, actionType]
    )

    return {
      allowed: true,
      remaining: maxRequests - currentLimit.request_count - 1,
      resetTime: new Date(
        new Date(currentLimit.window_start).getTime() + windowSize
      ),
    }
  } catch (error) {
    console.error("Rate limit check failed:", error)
    // On error, allow request but log the issue
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: new Date(now.getTime() + windowSize),
    }
  }
}

// Get client IP from request headers
export function getClientIP(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  )
}
