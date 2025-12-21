import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { ImageMetadata } from './types'
import { constructFullUrl, isValidImageUrl } from './metadata'

// Property page images
const PROPERTY_IMAGES = [
  {
    pageUrl: '/hill-crest-residency',
    images: [
      { url: '/media/hcr/hill-crest-residency-featured.webp', title: 'Hill Crest Residency - Luxury Apartments in Bahria Town Karachi' },
      { url: '/media/hcr/hcr-exterior-front-view.webp', title: 'Hill Crest Residency Exterior Front View' },
      { url: '/media/hcr/hcr-lobby-entrance.webp', title: 'Hill Crest Residency Modern Lobby Entrance' },
      { url: '/media/hcr/hcr-2bed-living-room.webp', title: 'Hill Crest Residency 2 Bedroom Living Room' },
      { url: '/media/hcr/hcr-3bed-master-bedroom.webp', title: 'Hill Crest Residency 3 Bedroom Master Suite' },
      { url: '/media/hcr/hcr-kitchen-modern.webp', title: 'Hill Crest Residency Modern Kitchen' },
      { url: '/media/hcr/hcr-gym-fitness.webp', title: 'Hill Crest Residency Gym and Fitness Center' },
      { url: '/media/hcr/hcr-rooftop-view.webp', title: 'Hill Crest Residency Rooftop Terrace View' },
    ],
  },
  {
    pageUrl: '/narkins-boutique-residency',
    images: [
      { url: '/media/nbr/narkins-boutique-residency-featured.webp', title: "Narkin's Boutique Residency - Premium Apartments Bahria Town" },
      { url: '/media/nbr/nbr-exterior-facade.webp', title: "Narkin's Boutique Residency Exterior Facade" },
      { url: '/media/nbr/nbr-heritage-club-view.webp', title: "Narkin's Boutique Residency Heritage Club View" },
      { url: '/media/nbr/nbr-4bed-penthouse.webp', title: "Narkin's Boutique Residency 4 Bedroom Penthouse" },
      { url: '/media/nbr/nbr-living-dining.webp', title: "Narkin's Boutique Residency Living and Dining Area" },
      { url: '/media/nbr/nbr-master-bathroom.webp', title: "Narkin's Boutique Residency Master Bathroom" },
      { url: '/media/nbr/nbr-balcony-panoramic.webp', title: "Narkin's Boutique Residency Panoramic Balcony View" },
    ],
  },
  {
    pageUrl: '/about',
    images: [
      { url: '/media/common/about/team/al-arz-about-page.webp', title: "Narkin's Builders Team - Al-Arz" },
      { url: '/media/common/about/narkins-builders-office.webp', title: "Narkin's Builders Office Bahria Town Karachi" },
      { url: '/media/common/about/construction-expertise.webp', title: "Narkin's Builders Construction Expertise" },
    ],
  },
]

export async function detectBlogImages(): Promise<ImageMetadata[]> {
  const images: ImageMetadata[] = []
  const blogsDir = join(process.cwd(), 'content', 'blogs')

  try {
    // Recursively find all .mdx files
    const years = readdirSync(blogsDir)

    for (const year of years) {
      const yearPath = join(blogsDir, year)
      const yearStat = readdirSync(yearPath)

      for (const month of yearStat) {
        const monthPath = join(yearPath, month)
        const mdxFiles = readdirSync(monthPath).filter((f) => f.endsWith('.mdx'))

        for (const mdxFile of mdxFiles) {
          const filePath = join(monthPath, mdxFile)
          const content = readFileSync(filePath, 'utf-8')

          // Parse frontmatter
          const { data: frontmatter, content: mdxContent } = matter(content)

          const slug = mdxFile.replace('.mdx', '')
          // Construct blog URL: /blog/2025/12/slug
          const blogUrl = `/blog/${year}/${month.split('-')[0]}/${slug}`
          const fullBlogUrl = constructFullUrl(blogUrl)

          // 1. Featured image from frontmatter
          if (frontmatter.image && isValidImageUrl(frontmatter.image as string)) {
            images.push({
              loc: fullBlogUrl,
              imageUrl: constructFullUrl(frontmatter.image as string),
              title: (frontmatter.title as string) || slug.replace(/-/g, ' '),
              caption: (frontmatter.excerpt as string) || undefined,
            })
          }

          // 2. Find inline images in MDX content
          // Match: <img src="..." alt="..." />, ![alt](url), <Image src="..." />, <ImageCarousel images={[{src: '...'}]} />
          const imagePatterns = [
            // Standard img tag
            /<img[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']*)["'][^>]*?\/?>/gi,
            // Markdown images
            /!\[([^\]]*)\]\(([^)]+)\)/gi,
            // Next.js Image component
            /<Image[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']*)["'][^>]*?\/?>/gi,
            // ImageCarousel items
            /\{src:\s*["']([^"']+)["']\s*,\s*alt:\s*["']([^"']*)["']\s*\}/gi,
          ]

          const foundImageUrls = new Set<string>()

          for (const pattern of imagePatterns) {
            let match
            while ((match = pattern.exec(mdxContent)) !== null) {
              let imageUrl: string
              let altText: string

              // Different capture groups for different patterns
              if (pattern.source.includes('!\\[')) {
                // Markdown: ![alt](url)
                altText = match[1]
                imageUrl = match[2]
              } else {
                // img/Image tag: src comes first
                imageUrl = match[1]
                altText = match[2] || ''
              }

              // Skip if not a valid image URL or already processed
              if (!isValidImageUrl(imageUrl) || foundImageUrls.has(imageUrl)) {
                continue
              }

              foundImageUrls.add(imageUrl)

              images.push({
                loc: fullBlogUrl,
                imageUrl: constructFullUrl(imageUrl),
                title: altText || (frontmatter.title as string) || slug.replace(/-/g, ' '),
                caption: altText || undefined,
              })
            }
          }
        }
      }
    }

    console.log(`Found ${images.length} blog images`)
  } catch (error) {
    console.warn('Error detecting blog images:', error instanceof Error ? error.message : String(error))
  }

  return images
}

export async function detectPropertyImages(): Promise<ImageMetadata[]> {
  const images: ImageMetadata[] = []

  for (const property of PROPERTY_IMAGES) {
    const fullPageUrl = constructFullUrl(property.pageUrl)

    for (const image of property.images) {
      // Check if image file exists by trying to construct URL
      if (isValidImageUrl(image.url)) {
        images.push({
          loc: fullPageUrl,
          imageUrl: constructFullUrl(image.url),
          title: image.title,
        })
      }
    }
  }

  console.log(`Found ${images.length} property images`)
  return images
}

export async function detectGalleryImages(): Promise<ImageMetadata[]> {
  const images: ImageMetadata[] = []
  const galleryPath = join(process.cwd(), 'public', 'media', 'gallery')

  try {
    // Check if gallery directory exists
    try {
      const galleryFiles = readdirSync(galleryPath).filter(f => isValidImageUrl(f))

      for (const imageFile of galleryFiles) {
        images.push({
          loc: constructFullUrl('/gallery'),
          imageUrl: constructFullUrl(`/media/gallery/${imageFile}`),
          title: `Narkin's Builders Gallery - ${imageFile.replace(/\.(webp|jpg|png)$/i, '').replace(/-/g, ' ')}`,
        })
      }
    } catch {
      // Gallery directory doesn't exist, skip
    }

    console.log(`Found ${images.length} gallery images`)
  } catch (error) {
    console.warn('Error detecting gallery images:', error instanceof Error ? error.message : String(error))
  }

  return images
}

export async function detectOtherPageImages(): Promise<ImageMetadata[]> {
  const images: ImageMetadata[] = []

  // Homepage hero images
  const homepageImages = [
    { url: '/media/hcr/hill-crest-residency-featured.webp', title: 'Hill Crest Residency - Premium Apartments Bahria Town Karachi' },
    { url: '/media/nbr/narkins-boutique-residency-featured.webp', title: "Narkin's Boutique Residency - Luxury Living Bahria Town" },
  ]

  const homeUrl = constructFullUrl('/')
  for (const image of homepageImages) {
    if (isValidImageUrl(image.url)) {
      images.push({
        loc: homeUrl,
        imageUrl: constructFullUrl(image.url),
        title: image.title,
      })
    }
  }

  console.log(`Found ${images.length} other page images`)
  return images
}
