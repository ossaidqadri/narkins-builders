import { create } from 'xmlbuilder2'
import { ImageMetadata } from './types'

export function generateImageSitemap(images: ImageMetadata[]): string {
  // Group images by page URL (Google Image Sitemap allows multiple images per URL)
  const imagesByPage = new Map<string, ImageMetadata[]>()

  for (const image of images) {
    if (!imagesByPage.has(image.loc)) {
      imagesByPage.set(image.loc, [])
    }
    imagesByPage.get(image.loc)?.push(image)
  }

  // Create XML document with proper namespaces
  const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
  })

  // Add URL entries for each page with images
  for (const [pageUrl, pageImages] of imagesByPage.entries()) {
    const urlElement = doc.ele('url')
    urlElement.ele('loc').txt(pageUrl)

    // Add all images for this page
    for (const image of pageImages) {
      const imageElement = urlElement.ele('image:image')

      // Required field: image location
      imageElement.ele('image:loc').txt(image.imageUrl)

      // Optional fields
      if (image.title) {
        imageElement.ele('image:title').txt(escapeXml(image.title))
      }

      if (image.caption) {
        imageElement.ele('image:caption').txt(escapeXml(image.caption))
      }

      if (image.geoLocation) {
        imageElement.ele('image:geo_location').txt(escapeXml(image.geoLocation))
      }

      if (image.license) {
        imageElement.ele('image:license').txt(image.license)
      }
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
