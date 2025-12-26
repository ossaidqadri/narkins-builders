import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { VideoMetadata } from './types'
import { constructFullUrl, extractDuration, formatISODate } from './metadata'

// REMOVED: Property videos (hill-crest.mp4, nbr.mp4) are on non-watch pages
// These should not be in video sitemap per Google's "watch page" requirement
// Video embeds on property pages don't need VideoObject schema

// REMOVED: YouTube videos don't need to be submitted in video sitemap
// Google already indexes them on youtube.com; submitting them on non-watch pages causes validation errors
// YouTube handles its own video discovery and indexing

export async function detectBlogVideos(): Promise<VideoMetadata[]> {
  const videos: VideoMetadata[] = []
  const blogsDir = join(process.cwd(), 'content', 'blogs')

  try {
    // Recursively find all .mdx files
    const years = readdirSync(blogsDir)

    for (const year of years) {
      const yearPath = join(blogsDir, year)
      const months = readdirSync(yearPath)

      for (const month of months) {
        const monthPath = join(yearPath, month)
        const mdxFiles = readdirSync(monthPath).filter((f) => f.endsWith('.mdx'))

        for (const mdxFile of mdxFiles) {
          const filePath = join(monthPath, mdxFile)
          const content = readFileSync(filePath, 'utf-8')

          // Parse frontmatter
          const { data: frontmatter, content: mdxContent } = matter(content)

          // Find video sources in content
          const videoRegexes = [/(<video[^>]*?src=["']([^"']+)["'])/gi, /(<VideoPlayer[^>]*?src=["']([^"']+)["'])/gi]

          const videoSources: string[] = []

          for (const regex of videoRegexes) {
            let match
            while ((match = regex.exec(mdxContent)) !== null) {
              videoSources.push(match[2])
            }
          }

          // Process each video found
          for (const videoSrc of videoSources) {
            const slug = mdxFile.replace('.mdx', '')

            // Construct blog URL from file structure
            // Format: /blog/2025/12/slug
            const blogUrl = `/blog/${year}/${month.split('-')[0]}/${slug}`

            const videoMetadata: VideoMetadata = {
              title: (frontmatter.title as string) || slug.replace(/-/g, ' '),
              description: (frontmatter.excerpt as string) || 'Video content',
              thumbnailUrl: frontmatter.image ? constructFullUrl(frontmatter.image as string) : '/media/common/blog-placeholder.webp',
              contentUrl: constructFullUrl(videoSrc),
              pageUrl: constructFullUrl(blogUrl),
              uploadDate: frontmatter.date ? formatISODate(frontmatter.date as string) : new Date().toISOString(),
              familyFriendly: true,
            }

            // Extract duration if available
            const duration = await extractDuration(videoSrc)
            if (duration) {
              videoMetadata.duration = duration
            }

            videos.push(videoMetadata)
          }
        }
      }
    }

    console.log(`Found ${videos.length} blog videos`)
  } catch (error) {
    console.warn('Error detecting blog videos:', error instanceof Error ? error.message : String(error))
  }

  return videos
}

export async function detectPropertyVideos(): Promise<VideoMetadata[]> {
  // DISABLED: Property showcase videos (Hill Crest, Boutique Residency) are not on watch pages
  // Per Google's requirement, VideoObject schema should only appear on pages dedicated to watching the video
  // Property pages are informational/sales pages where video is supporting content, not primary purpose
  console.log(`Found 0 property videos (property pages are not watch pages)`)
  return []
}

export async function detectYouTubeVideos(): Promise<VideoMetadata[]> {
  // DISABLED: YouTube videos don't need to be in our video sitemap
  // Google already indexes YouTube videos on youtube.com and their own platform
  // Submitting YouTube videos on non-watch pages (About, property pages) causes "Video isn't on a watch page" errors
  // YouTube handles video discovery and SEO for its own platform
  console.log(`Found 0 YouTube videos (YouTube handles its own video indexing)`)
  return []
}
