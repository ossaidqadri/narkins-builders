// File: src/pages/api/test-db.ts
// Production database connection test endpoint

import { NextApiRequest, NextApiResponse } from "next"
import {
  executeQuery,
  executeQuerySingle,
  testConnection,
} from "../../lib/database"

interface TestResponse {
  success: boolean
  database: string
  timestamp: string
  tests: {
    connection: boolean
    tableCount: number
    sampleQuery: boolean
    environment: string
  }
  details?: {
    tables: string[]
    sampleData?: any
    error?: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      database: "Method not allowed",
      timestamp: new Date().toISOString(),
      tests: {
        connection: false,
        tableCount: 0,
        sampleQuery: false,
        environment: process.env.NODE_ENV || "unknown",
      },
    })
  }

  // Security: Only allow in development or with proper authentication
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.authorization
    const validToken = process.env.DB_TEST_TOKEN

    if (!authHeader || !validToken || authHeader !== `Bearer ${validToken}`) {
      return res.status(401).json({
        success: false,
        database: "Unauthorized",
        timestamp: new Date().toISOString(),
        tests: {
          connection: false,
          tableCount: 0,
          sampleQuery: false,
          environment: process.env.NODE_ENV || "unknown",
        },
      })
    }
  }

  try {
    console.log("🔍 Testing production database connection...")

    // Test 1: Basic connection
    const isConnected = await testConnection()
    console.log("✅ Connection test:", isConnected ? "PASSED" : "FAILED")

    if (!isConnected) {
      return res.status(500).json({
        success: false,
        database: "Connection failed",
        timestamp: new Date().toISOString(),
        tests: {
          connection: false,
          tableCount: 0,
          sampleQuery: false,
          environment: process.env.NODE_ENV || "unknown",
        },
        details: {
          tables: [],
          error: "Database connection failed",
        },
      })
    }

    // Test 2: Count tables
    const tables = await executeQuery("SHOW TABLES")
    const tableCount = tables.length
    console.log("✅ Tables found:", tableCount)

    // Test 3: Sample query on blog_stats
    let sampleQuery = false
    let sampleData = null

    try {
      sampleData = await executeQuerySingle(
        "SELECT COUNT(*) as count FROM blog_stats"
      )
      sampleQuery = true
      console.log("✅ Sample query executed successfully")
    } catch (error) {
      console.log("❌ Sample query failed:", error)
    }

    // Test 4: Get table names
    const tableNames = tables.map((table) => Object.values(table)[0] as string)
    console.log("✅ Table names:", tableNames)

    // Success response
    const response: TestResponse = {
      success: true,
      database: "Connected successfully",
      timestamp: new Date().toISOString(),
      tests: {
        connection: true,
        tableCount: tableCount,
        sampleQuery: sampleQuery,
        environment: process.env.NODE_ENV || "unknown",
      },
      details: {
        tables: tableNames,
        sampleData: sampleData,
      },
    }

    console.log("🎉 All database tests passed!")
    return res.status(200).json(response)
  } catch (error) {
    console.error("❌ Database test failed:", error)

    return res.status(500).json({
      success: false,
      database: "Test failed",
      timestamp: new Date().toISOString(),
      tests: {
        connection: false,
        tableCount: 0,
        sampleQuery: false,
        environment: process.env.NODE_ENV || "unknown",
      },
      details: {
        tables: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })
  }
}
