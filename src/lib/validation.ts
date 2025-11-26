// Input validation schemas for comment system

import { z } from "zod"

// Comment creation schema
export const createCommentSchema = z.object({
  blogSlug: z.string().min(1).max(255),
  authorName: z.string().min(1).max(100).trim(),
  authorEmail: z.string().email().max(255).optional().or(z.literal("")),
  content: z.string().min(1).max(2000).trim(),
  recaptchaToken: z.string().min(1),
})

// Admin login schema
export const adminLoginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1),
})

// Comment moderation schema
export const moderateCommentSchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional(),
})

// Like comment schema
export const likeCommentSchema = z.object({
  commentId: z.number().int().positive(),
})

// Types derived from schemas
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>
export type LikeCommentInput = z.infer<typeof likeCommentSchema>

// Validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validData = schema.parse(data)
    return { success: true as const, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return {
        success: false as const,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      }
    }
    return { success: false as const, error: "Invalid input" }
  }
}

// Comment validation result interface
interface CommentValidationResult {
  isValid: boolean
  autoApproved: boolean
  score: number
  reason?: string
}

// Simple comment validation (without external services)
export async function validateComment(commentData: {
  author_name: string
  author_email: string
  content: string
  user_ip: string
}): Promise<CommentValidationResult> {
  try {
    // Basic validation checks
    const { author_name, author_email, content, user_ip } = commentData

    // Check for required fields
    if (!author_name?.trim() || !author_email?.trim() || !content?.trim()) {
      return {
        isValid: false,
        autoApproved: false,
        score: 0,
        reason: "Missing required fields",
      }
    }

    // Check for obviously fake emails
    if (!author_email.includes("@") || !author_email.includes(".")) {
      return {
        isValid: false,
        autoApproved: false,
        score: 0,
        reason: "Invalid email format",
      }
    }

    // Check content length
    if (content.trim().length < 10) {
      return {
        isValid: false,
        autoApproved: false,
        score: 0,
        reason: "Comment too short (minimum 10 characters)",
      }
    }

    if (content.trim().length > 2000) {
      return {
        isValid: false,
        autoApproved: false,
        score: 0,
        reason: "Comment too long (maximum 2000 characters)",
      }
    }

    // Basic spam detection
    const spamKeywords = [
      "viagra",
      "casino",
      "loan",
      "bitcoin",
      "cryptocurrency",
    ]
    const hasSpamKeywords = spamKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword)
    )

    if (hasSpamKeywords) {
      return {
        isValid: true,
        autoApproved: false,
        score: 0.2,
        reason: "Flagged for manual review",
      }
    }

    // Check for excessive caps or special characters
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
    const specialCharsRatio =
      (content.match(/[!@#$%^&*()]/g) || []).length / content.length

    if (capsRatio > 0.5 || specialCharsRatio > 0.1) {
      return {
        isValid: true,
        autoApproved: false,
        score: 0.3,
        reason: "Excessive caps or special characters",
      }
    }

    // Auto-approve if it passes basic checks
    return {
      isValid: true,
      autoApproved: true,
      score: 0.8,
    }
  } catch (error) {
    console.error("Comment validation error:", error)
    // On error, require manual approval
    return {
      isValid: true,
      autoApproved: false,
      score: 0.1,
      reason: "Validation service error",
    }
  }
}
