// Authentication middleware for admin routes
/** @deprecated
 * Kabeer's Network Authors 2025 (c)
 **/
import { NextApiRequest, NextApiResponse } from "next"
import { extractTokenFromHeader, JWTPayload, verifyToken } from "./jwt"

export interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void

export function withAuth(
  handler: AuthenticatedHandler,
  requiredRole?: "admin" | "moderator"
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract token from Authorization header
      const token = extractTokenFromHeader(req.headers.authorization)

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No authorization token provided",
        })
      }

      // Verify token
      const user = verifyToken(token)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        })
      }

      // Check role permissions
      if (requiredRole) {
        if (requiredRole === "admin" && user.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Admin access required",
          })
        }

        // Both admin and moderator can access moderator routes
        if (
          requiredRole === "moderator" &&
          !["admin", "moderator"].includes(user.role)
        ) {
          return res.status(403).json({
            success: false,
            message: "Moderator access required",
          })
        }
      }
      // Add user to request
      ;(req as AuthenticatedRequest).user = user

      // Call the handler
      return handler(req as AuthenticatedRequest, res)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      })
    }
  }
}
