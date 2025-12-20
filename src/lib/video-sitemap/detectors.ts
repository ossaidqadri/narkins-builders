import { readdirSync, readFileSync, statSync } from 'fs'
import { join, parse } from 'path'
import matter from 'gray-matter'
import { VideoMetadata } from './types'
import { constructFullUrl, extractDuration, formatISODate, convertMonthNumberToName } from './metadata'

const PROPERTY_VIDEOS = [
  {
    pageUrl: '/hill-crest-residency',
    videoUrl: '/media/hcr/videos/hillcrest.mp4',
    title: 'Hill Crest Residency - Luxury Apartments Tour',
    description: 'Virtual tour of Hill Crest Residency luxury apartments in Bahria Town Karachi',
    thumbnailUrl: '/media/hcr/hill-crest-residency-featured.webp',
  },
  {
    pageUrl: '/narkins-boutique-residency',
    videoUrl: '/media/nbr/videos/nbr.mp4',
    title: "Narkin's Boutique Residency - Premium Apartments",
    description: "Explore Narkin's Boutique Residency premium apartments with Heritage Club views",
    thumbnailUrl: '/media/nbr/narkins-boutique-residency-featured.webp',
  },
]

const YOUTUBE_VIDEO_PAGES: Record<string, string> = {
  tT7kkMM0pz0: '/about',
  '9pJsF3BciCA': '/about',
  A3WkwMWBZ_8: '/about',
  BLnpB8VTnJA: '/about',
  TSiLOTW2s4g: '/hill-crest-residency',
  '5zv639iO31w': '/hill-crest-residency',
  D5YaV4CdaxE: '/hill-crest-residency',
  iNbSrOL8HD4: '/hill-crest-residency',
  FmEHTzdjXEc: '/narkins-boutique-residency',
  uzYVdqFHovs: '/narkins-boutique-residency',
  n8PT4z9MdRA: '/narkins-boutique-residency',
  'DClpF8-xaS8': '/narkins-boutique-residency',
}

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
              pageUrl: blogUrl,
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
  const videos: VideoMetadata[] = []

  for (const video of PROPERTY_VIDEOS) {
    const videoMetadata: VideoMetadata = {
      title: video.title,
      description: video.description,
      thumbnailUrl: constructFullUrl(video.thumbnailUrl),
      contentUrl: constructFullUrl(video.videoUrl),
      pageUrl: video.pageUrl,
      familyFriendly: true,
    }

    // Extract duration
    const duration = await extractDuration(video.videoUrl)
    if (duration) {
      videoMetadata.duration = duration
    }

    videos.push(videoMetadata)
  }

  console.log(`Found ${videos.length} property videos`)
  return videos
}

interface YouTubeOembedResponse {
  title?: string
  thumbnail_url?: string
  author_name?: string
}

interface YouTubeVideo {
  id: string
  title: string
  description?: string
  category?: string
}

async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeOembedResponse | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`YouTube oEmbed failed for ${videoId}:`, response.statusText)
      return null
    }

    return (await response.json()) as YouTubeOembedResponse
  } catch (error) {
    console.warn(`Error fetching YouTube metadata for ${videoId}:`, error instanceof Error ? error.message : String(error))
    return null
  }
}

export async function detectYouTubeVideos(): Promise<VideoMetadata[]> {
  const videos: VideoMetadata[] = []

  try {
    // Import about-data to get YouTube video arrays
    const { featuredVideos, hcrYoutubeVideos, nbrYoutubeVideos } = await import('../../data/about-data')

    const allYoutubeVideos: Array<YouTubeVideo & { pageUrl: string }> = [
      ...((featuredVideos as YouTubeVideo[]) || []).map((v) => ({ ...v, pageUrl: '/about' })),
      ...((hcrYoutubeVideos as YouTubeVideo[]) || []).map((v) => ({ ...v, pageUrl: '/hill-crest-residency' })),
      ...((nbrYoutubeVideos as YouTubeVideo[]) || []).map((v) => ({ ...v, pageUrl: '/narkins-boutique-residency' })),
    ]

    for (const youtubeVideo of allYoutubeVideos) {
      const oembedData = await fetchYouTubeMetadata(youtubeVideo.id)

      const videoMetadata: VideoMetadata = {
        title: oembedData?.title || youtubeVideo.title || 'Narkin\'s Builders Video',
        description: youtubeVideo.description || 'Video content from Narkin\'s Builders',
        thumbnailUrl: oembedData?.thumbnail_url || `https://img.youtube.com/vi/${youtubeVideo.id}/maxresdefault.jpg`,
        playerUrl: `https://www.youtube.com/watch?v=${youtubeVideo.id}`,
        pageUrl: youtubeVideo.pageUrl,
        familyFriendly: true,
      }

      videos.push(videoMetadata)
    }

    console.log(`Found ${videos.length} YouTube videos`)
  } catch (error) {
    console.warn('Error detecting YouTube videos:', error instanceof Error ? error.message : String(error))
  }

  return videos
}
