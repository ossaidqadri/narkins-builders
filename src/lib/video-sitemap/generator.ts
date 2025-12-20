import { create } from 'xmlbuilder2'
import { VideoMetadata } from './types'

export function generateVideoSitemap(videos: VideoMetadata[]): string {
  // Group videos by page URL (Google Video Sitemap allows multiple videos per URL)
  const videosByPage = new Map<string, VideoMetadata[]>()

  for (const video of videos) {
    if (!videosByPage.has(video.pageUrl)) {
      videosByPage.set(video.pageUrl, [])
    }
    videosByPage.get(video.pageUrl)?.push(video)
  }

  // Create XML document with proper namespaces
  const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
  })

  // Add URL entries for each page with videos
  for (const [pageUrl, pageVideos] of videosByPage.entries()) {
    const urlElement = doc.ele('url')
    urlElement.ele('loc').txt(pageUrl)

    // Add all videos for this page
    for (const video of pageVideos) {
      const videoElement = urlElement.ele('video:video')

      // Required fields
      videoElement.ele('video:title').txt(escapeXml(video.title))
      videoElement.ele('video:description').txt(escapeXml(video.description))

      // Thumbnail
      videoElement.ele('video:thumbnail_loc').txt(video.thumbnailUrl)

      // Content location - prefer playerUrl for YouTube, contentUrl for local files
      if (video.playerUrl) {
        videoElement.ele('video:player_loc').txt(video.playerUrl)
      } else if (video.contentUrl) {
        videoElement.ele('video:content_loc').txt(video.contentUrl)
      }

      // Optional fields
      if (video.duration) {
        videoElement.ele('video:duration').txt(video.duration.toString())
      }

      if (video.uploadDate) {
        videoElement.ele('video:publication_date').txt(video.uploadDate)
      }

      if (video.familyFriendly !== undefined) {
        videoElement.ele('video:family_friendly').txt(video.familyFriendly ? 'yes' : 'no')
      }

      // Uploader information
      const uploaderElement = videoElement.ele('video:uploader', {
        info: 'https://narkinsbuilders.com/about',
      })
      uploaderElement.txt("Narkin's Builders")
    }
  }

  return doc.end({ prettyPrint: true })
}

function escapeXml(str: string): string {
  if (!str) return ''

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
