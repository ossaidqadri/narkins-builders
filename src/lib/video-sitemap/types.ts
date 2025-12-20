export interface VideoMetadata {
  // Required fields
  title: string
  description: string
  thumbnailUrl: string
  contentUrl?: string // For local .mp4 files
  pageUrl: string

  // Optional fields
  duration?: number // in seconds
  uploadDate?: string // ISO 8601
  playerUrl?: string // For YouTube
  familyFriendly?: boolean
}

export type VideoSource = 'blog' | 'property' | 'youtube'

export interface VideoDetectionResult {
  source: VideoSource
  videos: VideoMetadata[]
  errors?: string[]
}
