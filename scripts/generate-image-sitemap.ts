import { detectBlogImages, detectPropertyImages, detectGalleryImages, detectOtherPageImages } from '../src/lib/image-sitemap/detectors'
import { generateImageSitemap } from '../src/lib/image-sitemap/generator'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

async function main() {
  console.log('\n📸 Starting image sitemap generation...\n')

  try {
    // Detect images from all sources
    const blogImages = await detectBlogImages()
    const propertyImages = await detectPropertyImages()
    const galleryImages = await detectGalleryImages()
    const otherImages = await detectOtherPageImages()

    const allImages = [...blogImages, ...propertyImages, ...galleryImages, ...otherImages]

    console.log(`\n✅ Found ${allImages.length} total images:`)
    console.log(`   • Blog images: ${blogImages.length}`)
    console.log(`   • Property images: ${propertyImages.length}`)
    console.log(`   • Gallery images: ${galleryImages.length}`)
    console.log(`   • Other page images: ${otherImages.length}\n`)

    if (allImages.length === 0) {
      console.warn('⚠️  No images found. Sitemap will be empty.')
    }

    // Generate image sitemap XML
    const xml = generateImageSitemap(allImages)

    // Write to public/sitemap-images.xml
    const outputPath = join(process.cwd(), 'public', 'sitemap-images.xml')
    writeFileSync(outputPath, xml, 'utf-8')
    console.log(`✅ Image sitemap written to: public/sitemap-images.xml`)

    // Update main sitemap index to include image sitemap
    updateSitemapIndex()
    console.log('✅ Main sitemap index updated\n')

    console.log('🎉 Image sitemap generation complete!\n')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('❌ Error generating image sitemap:', errorMsg)
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')
    process.exit(1)
  }
}

function updateSitemapIndex() {
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml')

  try {
    const currentContent = readFileSync(sitemapPath, 'utf-8')

    // Check if image sitemap already referenced
    if (currentContent.includes('sitemap-images.xml')) {
      console.log('ℹ️  Image sitemap already referenced in index')
      return
    }

    // Add image sitemap reference before closing </sitemapindex>
    const imageSitemapEntry = `  <sitemap>
    <loc>https://www.narkinsbuilders.com/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`

    const updatedContent = currentContent.replace('</sitemapindex>', `${imageSitemapEntry}\n</sitemapindex>`)

    writeFileSync(sitemapPath, updatedContent, 'utf-8')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.warn('⚠️  Could not update main sitemap index:', errorMsg)
    // Don't fail the build if we can't update the index
  }
}

main()
