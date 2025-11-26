import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { title, text, url } = req.body

  // Here you can process the shared content
  // For example, save to database, send email, etc.

  // Redirect to a thank you page or home page
  res.redirect(302, "/?shared=true")
}
