// API endpoint: POST /api/admin/auth/login - Admin login

import { NextApiRequest, NextApiResponse } from "next"
import { adminLoginSchema, validateInput } from "../../../../lib/validation"
import { comparePassword, generateToken } from "../../../../lib/jwt"
import { executeQuerySingle } from "../../../../lib/database"
import { getClientIP } from "../../../../lib/rate-limit"

interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: number
    username: string
    email: string
    role: "admin" | "moderator"
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    })
  }

  try {
    // Validate input
    const validation = validateInput(adminLoginSchema, req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      })
    }

    const { username, password } = validation.data
    const userIp = getClientIP(req)

    // Find admin user
    const user = await executeQuerySingle<{
      id: number
      username: string
      email: string
      password_hash: string
      role: "admin" | "moderator"
      active: boolean
    }>(
      "SELECT id, username, email, password_hash, role, active FROM admin_users WHERE username = ? AND active = TRUE",
      [username]
    )

    if (!user) {
      console.warn(
        `Failed login attempt for username: ${username} from IP: ${userIp}`
      )
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Verify password
    const passwordValid = await comparePassword(password, user.password_hash)
    if (!passwordValid) {
      console.warn(
        `Failed login attempt for username: ${username} from IP: ${userIp}`
      )
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    const token = generateToken(tokenPayload)

    // Update last login
    await executeQuerySingle(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    )

    console.log(`Successful login for admin: ${username} from IP: ${userIp}`)

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return res.status(500).json({
      success: false,
      message: "Login failed",
    })
  }
}
