import { getVideoDurationInSeconds } from 'get-video-duration'
import { join } from 'path'
import { existsSync } from 'fs'

const SITE_URL = 'https://www.narkinsbuilders.com'

export function constructFullUrl(relativePath: string): string {
  // Ensure path starts with /
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
  return `${SITE_URL}${path}`
}

export async function extractDuration(videoPath: string): Promise<number | undefined> {
  try {
    // Check if it's a local file path
    if (!videoPath.startsWith('http')) {
      const fullPath = join(process.cwd(), 'public', videoPath)

      if (!existsSync(fullPath)) {
        console.warn(`Video file not found: ${fullPath}`)
        return undefined
      }

      const durationInSeconds = await getVideoDurationInSeconds(fullPath)
      return Math.round(durationInSeconds)
    }

    // For remote URLs, we can't extract duration
    return undefined
  } catch (error) {
    console.warn(`Failed to extract duration for ${videoPath}:`, error instanceof Error ? error.message : String(error))
    return undefined
  }
}

export function formatISODate(date: Date | string): string {
  if (typeof date === 'string') {
    // Convert to ISO string and remove milliseconds for Schema.org compatibility
    return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z')
  }
  // Convert to ISO string and remove milliseconds for Schema.org compatibility
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

export function convertMonthNumberToName(month: number | string): string {
  const monthMap: Record<string | number, string> = {
    '01': 'january',
    '02': 'february',
    '03': 'march',
    '04': 'april',
    '05': 'may',
    '06': 'june',
    '07': 'july',
    '08': 'august',
    '09': 'september',
    '10': 'october',
    11: 'november',
    12: 'december',
  }

  const monthName = monthMap[month]
  if (!monthName) {
    throw new Error(`Invalid month: ${month}`)
  }
  return monthName
}
