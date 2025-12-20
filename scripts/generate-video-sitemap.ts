import { detectBlogVideos, detectPropertyVideos, detectYouTubeVideos } from '../src/lib/video-sitemap/detectors'
import { generateVideoSitemap } from '../src/lib/video-sitemap/generator'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

async function main() {
  console.log('\n🎥 Starting video sitemap generation...\n')

  try {
    // Detect videos from all sources
    const blogVideos = await detectBlogVideos()
    const propertyVideos = await detectPropertyVideos()
    const youtubeVideos = await detectYouTubeVideos()

    const allVideos = [...blogVideos, ...propertyVideos, ...youtubeVideos]

    console.log(`\n✅ Found ${allVideos.length} total videos:`)
    console.log(`   • Blog videos: ${blogVideos.length}`)
    console.log(`   • Property videos: ${propertyVideos.length}`)
    console.log(`   • YouTube videos: ${youtubeVideos.length}\n`)

    if (allVideos.length === 0) {
      console.warn('⚠️  No videos found. Sitemap will be empty.')
    }

    // Generate video sitemap XML
    const xml = generateVideoSitemap(allVideos)

    // Write to public/sitemap-videos.xml
    const outputPath = join(process.cwd(), 'public', 'sitemap-videos.xml')
    writeFileSync(outputPath, xml, 'utf-8')
    console.log(`✅ Video sitemap written to: public/sitemap-videos.xml`)

    // Update main sitemap index to include video sitemap
    updateSitemapIndex()
    console.log('✅ Main sitemap index updated\n')

    console.log('🎉 Video sitemap generation complete!\n')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('❌ Error generating video sitemap:', errorMsg)
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')
    process.exit(1)
  }
}

function updateSitemapIndex() {
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml')

  try {
    const currentContent = readFileSync(sitemapPath, 'utf-8')

    // Check if video sitemap already referenced
    if (currentContent.includes('sitemap-videos.xml')) {
      console.log('ℹ️  Video sitemap already referenced in index')
      return
    }

    // Add video sitemap reference before closing </sitemapindex>
    const videoSitemapEntry = `  <sitemap>
    <loc>https://www.narkinsbuilders.com/sitemap-videos.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`

    const updatedContent = currentContent.replace('</sitemapindex>', `${videoSitemapEntry}\n</sitemapindex>`)

    writeFileSync(sitemapPath, updatedContent, 'utf-8')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.warn('⚠️  Could not update main sitemap index:', errorMsg)
    // Don't fail the build if we can't update the index
  }
}

main()
