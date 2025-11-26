import { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, email, phone, property, timestamp, source, userAgent, url } =
      req.body

    // Validate required fields
    if (!name || !email || !phone || !property) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      throw new Error("Google Sheet ID not configured")
    }

    // Prepare data for insertion
    const values = [
      [
        new Date(timestamp).toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        name,
        email,
        phone,
        property,
        source || "website_form",
        userAgent || "Unknown",
        url || "Unknown",
      ],
    ]

    // Insert data into Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:H", // Adjust range as needed
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    })

    return res.status(200).json({
      success: true,
      message: "Data submitted successfully",
      updatedRows: response.data.updates?.updatedRows || 0,
    })
  } catch (error) {
    console.error("❌ Google Sheets API error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to submit data to Google Sheets",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    })
  }
}
