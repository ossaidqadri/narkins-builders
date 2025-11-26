// JWT authentication utilities

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export interface JWTPayload {
  userId: number
  username: string
  role: "admin" | "moderator"
  email: string
}

export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET not configured")
  }

  return jwt.sign(payload, secret, {
    expiresIn: "24h",
    issuer: "narkins-builders",
    audience: "admin-panel",
  })
}

export function verifyToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET not configured")
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: "narkins-builders",
      audience: "admin-panel",
    }) as JWTPayload

    return decoded
  } catch (error) {
    console.warn("JWT verification failed:", error.message)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.slice(7) // Remove 'Bearer ' prefix
}
