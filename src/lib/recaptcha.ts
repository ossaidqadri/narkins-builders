// ReCAPTCHA verification utility

interface RecaptchaResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  "error-codes"?: string[]
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  // Skip ReCAPTCHA verification in development
  if (process.env.NODE_ENV === "development") {
    console.log("🔓 Skipping ReCAPTCHA verification in development mode")
    return true
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY not configured")
    return false
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    )

    const data: RecaptchaResponse = await response.json()

    if (!data.success) {
      console.warn("ReCAPTCHA verification failed:", data["error-codes"])
      return false
    }

    return true
  } catch (error) {
    console.error("ReCAPTCHA verification error:", error)
    return false
  }
}
