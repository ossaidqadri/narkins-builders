import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { BlogPost } from "./blog"

const postsDirectory = path.join(process.cwd(), "content/blogs")
const mdxCacheDir = path.join(process.cwd(), ".mdx-cache")

// In-memory cache for faster access
let postsCache: BlogPost[] | null = null
let cacheTimestamp: number = 0
let indexCacheData: any = null
let indexCacheTimestamp: number = 0

const CACHE_TTL = process.env.NODE_ENV === "development" ? 30000 : 300000
const INDEX_CACHE_TTL = 60000 // 1 minute for index cache
const EXPECTED_CACHE_VERSION = "1.3.0"

// Statistics tracking
let cacheStats = {
  hits: 0,
  misses: 0,
  errors: 0,
  fallbacks: 0,
  totalRequests: 0,
}

// Utility function for safe JSON parsing
function safeJsonParse(content: string, fallback: any = null) {
  try {
    return JSON.parse(content)
  } catch (error) {
    console.warn("[MDX Cache] Invalid JSON content, returning fallback")
    return fallback
  }
}

// Utility function to check cache validity
function isCacheValid(cached: any): boolean {
  if (!cached) return false

  // Check required fields
  const requiredFields = ["slug", "title", "date"]
  for (const field of requiredFields) {
    if (!cached[field]) {
      console.warn(`[MDX Cache] Missing required field: ${field}`)
      return false
    }
  }

  // Check cache version if available
  if (cached.cacheVersion && cached.cacheVersion !== EXPECTED_CACHE_VERSION) {
    console.warn(
      `[MDX Cache] Version mismatch: expected ${EXPECTED_CACHE_VERSION}, got ${cached.cacheVersion}`
    )
    return false
  }

  return true
}

// Function to get cache statistics
export function getCacheStats() {
  return {
    ...cacheStats,
    hitRate:
      cacheStats.totalRequests > 0
        ? ((cacheStats.hits / cacheStats.totalRequests) * 100).toFixed(2) + "%"
        : "0%",
    fallbackRate:
      cacheStats.totalRequests > 0
        ? ((cacheStats.fallbacks / cacheStats.totalRequests) * 100).toFixed(2) +
          "%"
        : "0%",
  }
}

// Reset cache statistics
export function resetCacheStats() {
  cacheStats = { hits: 0, misses: 0, errors: 0, fallbacks: 0, totalRequests: 0 }
}

export function getAllPostsServer(): BlogPost[] {
  cacheStats.totalRequests++

  // Use in-memory cache if available and not expired
  const now = Date.now()
  if (postsCache && now - cacheTimestamp < CACHE_TTL) {
    cacheStats.hits++
    return postsCache
  }

  // Try to load from pre-compiled MDX cache first with enhanced validation
  const indexPath = path.join(mdxCacheDir, "index.json")
  if (fs.existsSync(indexPath)) {
    try {
      // Use cached index data if available and fresh
      let cacheData: any
      if (indexCacheData && now - indexCacheTimestamp < INDEX_CACHE_TTL) {
        cacheData = indexCacheData
      } else {
        const rawData = fs.readFileSync(indexPath, "utf8")
        cacheData = safeJsonParse(rawData)
        if (cacheData) {
          indexCacheData = cacheData
          indexCacheTimestamp = now
        }
      }

      if (cacheData && cacheData.posts && Array.isArray(cacheData.posts)) {
        // Validate cache version and content
        if (cacheData.cacheVersion !== EXPECTED_CACHE_VERSION) {
          console.warn(
            `[MDX] Cache version mismatch in index: ${cacheData.cacheVersion} vs ${EXPECTED_CACHE_VERSION}`
          )
          cacheStats.errors++
          return getAllPostsFromFS()
        }

        // Validate individual posts
        const validPosts = cacheData.posts.filter(isCacheValid)
        if (validPosts.length !== cacheData.posts.length) {
          console.warn(
            `[MDX] Found ${cacheData.posts.length - validPosts.length} invalid posts in cache`
          )
        }

        if (validPosts.length > 0) {
          postsCache = validPosts.map((post: any) => ({
            ...post,
            content: "", // Content not needed for list view
          }))
          cacheTimestamp = now
          cacheStats.hits++

          const statsMsg = cacheData.buildStats
            ? ` (built in ${cacheData.buildStats.totalTime} with ${cacheData.buildStats.workersUsed} workers)`
            : ""
          console.log(
            `[MDX] SUCCESS: Loaded ${postsCache.length} posts from precompiled cache${statsMsg}`
          )
          return postsCache
        }
      }

      throw new Error("Invalid cache data structure")
    } catch (error) {
      cacheStats.errors++
      console.warn(
        `[MDX] WARNING: Failed to load precompiled MDX cache: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      console.warn("[MDX] Falling back to file system")
    }
  } else {
    console.log("[MDX] No precompiled cache found, using file system")
  }

  // Fallback to direct file system reading
  cacheStats.fallbacks++
  console.log("[MDX] INFO: Loading posts from file system (no cache available)")
  return getAllPostsFromFS()
}

// Recursive function to find all .mdx files in subdirectories
function findAllMdxFiles(
  dir: string
): Array<{ fullPath: string; relativePath: string; slug: string }> {
  const results: Array<{
    fullPath: string
    relativePath: string
    slug: string
  }> = []

  function scanDirectory(currentDir: string, relativePath: string = "") {
    const items = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(currentDir, item.name)
      const itemRelativePath = relativePath
        ? path.join(relativePath, item.name)
        : item.name

      if (item.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(itemPath, itemRelativePath)
      } else if (item.isFile() && item.name.endsWith(".mdx")) {
        // Extract slug from filename and create URL-friendly path
        const slug = item.name.replace(/\.mdx$/, "")
        results.push({
          fullPath: itemPath,
          relativePath: itemRelativePath,
          slug,
        })
      }
    }
  }

  scanDirectory(dir)
  return results
}

function getAllPostsFromFS(): BlogPost[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`[MDX] Posts directory does not exist: ${postsDirectory}`)
      return []
    }

    const mdxFiles = findAllMdxFiles(postsDirectory)

    if (mdxFiles.length === 0) {
      console.warn("[MDX] No .mdx files found in posts directory")
      return []
    }

    console.log(`[MDX] Processing ${mdxFiles.length} files from file system`)

    const allPostsData: BlogPost[] = []

    for (const fileInfo of mdxFiles) {
      try {
        const slug = fileInfo.slug
        const fullPath = fileInfo.fullPath

        if (!fs.existsSync(fullPath)) {
          console.warn(`[MDX] File not found: ${fullPath}`)
          continue
        }

        const fileContents = fs.readFileSync(fullPath, "utf8")
        if (!fileContents.trim()) {
          console.warn(`[MDX] Empty file: ${fileName}`)
          continue
        }

        const matterResult = matter(fileContents)
        const stat = fs.statSync(fullPath)

        const post: BlogPost = {
          slug,
          title: matterResult.data.title || "Untitled",
          excerpt: matterResult.data.excerpt || "",
          date: matterResult.data.date
            ? new Date(matterResult.data.date).toISOString()
            : new Date().toISOString(),
          image:
            matterResult.data.image || "/images/narkins-builders-logo.webp",
          content: matterResult.content,
          readTime: matterResult.data.readTime || "5 min read",
          keywords: matterResult.data.keywords || "",
          lastModified: new Date(stat.mtime).toISOString(),
        }

        allPostsData.push(post)
      } catch (fileError) {
        console.error(
          `[MDX] Error processing ${fileName}:`,
          fileError instanceof Error ? fileError.message : "Unknown error"
        )
        continue
      }
    }

    const sorted = allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    postsCache = sorted
    cacheTimestamp = Date.now()

    console.log(`[MDX] SUCCESS: Loaded ${sorted.length} posts from file system`)
    return sorted
  } catch (error) {
    console.error("[MDX] Fatal error loading posts from file system:", error)
    return []
  }
}

export function getPostBySlugServer(slug: string): BlogPost | null {
  if (!slug || typeof slug !== "string") {
    console.warn("[MDX] Invalid slug provided:", slug)
    return null
  }

  cacheStats.totalRequests++

  // Try to get from precompiled MDX cache first
  const cacheFilePath = path.join(mdxCacheDir, `${slug}.json`)
  if (fs.existsSync(cacheFilePath)) {
    try {
      const rawData = fs.readFileSync(cacheFilePath, "utf8")
      const cached = safeJsonParse(rawData)

      if (!cached) {
        throw new Error("Invalid JSON in cache file")
      }

      // Validate cached data
      if (!isCacheValid(cached)) {
        throw new Error("Cache data validation failed")
      }

      // Check cache version
      if (cached.cacheVersion !== EXPECTED_CACHE_VERSION) {
        console.warn(
          `[MDX] Cache version mismatch for ${slug}: ${cached.cacheVersion} vs ${EXPECTED_CACHE_VERSION}`
        )
        throw new Error("Cache version mismatch")
      }

      cacheStats.hits++
      console.log(
        `[MDX] SUCCESS: Cache hit for: ${slug} (processed in ${cached.processingTime || "unknown"}ms)`
      )

      return {
        slug: cached.slug,
        title: cached.title,
        excerpt: cached.excerpt,
        date: cached.date,
        image: cached.image,
        readTime: cached.readTime,
        keywords: cached.keywords,
        content: "", // Content not needed since we have serialized MDX
        lastModified: cached.lastModified
          ? new Date(cached.lastModified).toISOString()
          : cached.date,
      }
    } catch (error) {
      cacheStats.errors++
      console.warn(
        `[MDX] WARNING: Failed to load cached post ${slug}: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      console.warn("[MDX] Falling back to file system")
    }
  } else {
    cacheStats.misses++
  }

  // Fallback to file system
  cacheStats.fallbacks++
  console.log(`[MDX] INFO: Cache miss for ${slug}, using file system`)
  return getPostFromFS(slug)
}

function getPostFromFS(slug: string): BlogPost | null {
  try {
    // Search recursively for the file by slug
    const mdxFiles = findAllMdxFiles(postsDirectory)
    const targetFile = mdxFiles.find((file) => file.slug === slug)

    if (!targetFile) {
      console.log(`[MDX] Post file not found: ${slug}.mdx`)
      return null
    }

    const fullPath = targetFile.fullPath

    if (!fs.existsSync(fullPath)) {
      console.log(`[MDX] Post file not found: ${slug}.mdx`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    if (!fileContents.trim()) {
      console.warn(`[MDX] Empty content for: ${slug}`)
      return null
    }

    const matterResult = matter(fileContents)
    const stat = fs.statSync(fullPath)

    // Basic validation
    if (!matterResult.data.title) {
      console.warn(`[MDX] Missing title for: ${slug}`)
    }

    const post: BlogPost = {
      slug,
      title: matterResult.data.title || "Untitled",
      excerpt: matterResult.data.excerpt || "",
      date: matterResult.data.date
        ? new Date(matterResult.data.date).toISOString()
        : new Date().toISOString(),
      image: matterResult.data.image || "/images/narkins-builders-logo.webp",
      content: matterResult.content,
      readTime: matterResult.data.readTime || "5 min read",
      keywords: matterResult.data.keywords || "",
      lastModified: new Date(stat.mtime).toISOString(),
    }

    return post
  } catch (error) {
    console.error(
      `[MDX] Error loading post ${slug}:`,
      error instanceof Error ? error.message : "Unknown error"
    )
    return null
  }
}

export function getAdjacentPosts(currentSlug: string) {
  if (!currentSlug || typeof currentSlug !== "string") {
    console.warn("[MDX] Invalid currentSlug for adjacent posts:", currentSlug)
    return { previousPost: null, nextPost: null }
  }

  try {
    const posts = getAllPostsServer()

    if (!posts || posts.length === 0) {
      return { previousPost: null, nextPost: null }
    }

    const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

    if (currentIndex === -1) {
      console.warn(`[MDX] Current post not found in list: ${currentSlug}`)
      return { previousPost: null, nextPost: null }
    }

    const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null
    const nextPost =
      currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

    return {
      previousPost: previousPost
        ? {
            slug: previousPost.slug,
            title: previousPost.title,
            excerpt: previousPost.excerpt,
            date: previousPost.date,
          }
        : null,
      nextPost: nextPost
        ? {
            slug: nextPost.slug,
            title: nextPost.title,
            excerpt: nextPost.excerpt,
            date: nextPost.date,
          }
        : null,
    }
  } catch (error) {
    console.error("[MDX] Error getting adjacent posts:", error)
    return { previousPost: null, nextPost: null }
  }
}

// Function to get precompiled MDX with enhanced validation
export function getPrecompiledMDX(slug: string) {
  if (!slug || typeof slug !== "string") {
    console.warn("[MDX] Invalid slug for precompiled MDX:", slug)
    return null
  }

  const cacheFilePath = path.join(mdxCacheDir, `${slug}.json`)

  if (!fs.existsSync(cacheFilePath)) {
    return null
  }

  try {
    const rawData = fs.readFileSync(cacheFilePath, "utf8")
    const cached = safeJsonParse(rawData)

    if (!cached) {
      console.warn(`[MDX] Invalid JSON in cache file for ${slug}`)
      return null
    }

    // Validate cache structure
    if (!cached.serializedMDX) {
      console.warn(`[MDX] Missing serializedMDX in cache for ${slug}`)
      return null
    }

    // Validate cache version
    if (cached.cacheVersion && cached.cacheVersion !== EXPECTED_CACHE_VERSION) {
      console.warn(
        `[MDX] Cache version mismatch for ${slug}: ${cached.cacheVersion} vs ${EXPECTED_CACHE_VERSION}`
      )
      return null
    }

    // Validate serialized MDX structure
    const serialized = cached.serializedMDX
    if (!serialized.compiledSource && !serialized.frontmatter) {
      console.warn(`[MDX] Invalid serialized MDX structure for ${slug}`)
      return null
    }

    return serialized
  } catch (error) {
    console.error(
      `[MDX] ERROR: Failed to load precompiled MDX for ${slug}:`,
      error instanceof Error ? error.message : "Unknown error"
    )
    return null
  }
}

// Function to check if post has valid precompiled MDX
export function hasPrecompiledMDX(slug: string): boolean {
  if (!slug || typeof slug !== "string") {
    return false
  }

  const cacheFilePath = path.join(mdxCacheDir, `${slug}.json`)

  if (!fs.existsSync(cacheFilePath)) {
    return false
  }

  try {
    const rawData = fs.readFileSync(cacheFilePath, "utf8")
    const cached = safeJsonParse(rawData)

    if (!cached || !cached.serializedMDX) {
      return false
    }

    // Quick validation of cache version
    if (cached.cacheVersion && cached.cacheVersion !== EXPECTED_CACHE_VERSION) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

// Function to clear all caches (useful for development)
export function clearAllCaches() {
  postsCache = null
  indexCacheData = null
  cacheTimestamp = 0
  indexCacheTimestamp = 0
  resetCacheStats()
  console.log("[MDX] All caches cleared")
}

// Function to get cache directory info
export function getCacheInfo() {
  try {
    if (!fs.existsSync(mdxCacheDir)) {
      return { exists: false, totalFiles: 0, indexExists: false }
    }

    const files = fs.readdirSync(mdxCacheDir)
    const mdxFiles = files.filter(
      (f) => f.endsWith(".json") && f !== "index.json"
    )
    const indexExists = fs.existsSync(path.join(mdxCacheDir, "index.json"))

    let indexInfo = null
    if (indexExists) {
      try {
        const indexData = safeJsonParse(
          fs.readFileSync(path.join(mdxCacheDir, "index.json"), "utf8")
        )
        indexInfo = {
          totalPosts: indexData?.totalPosts || 0,
          lastUpdated: indexData?.lastUpdated || "unknown",
          cacheVersion: indexData?.cacheVersion || "unknown",
          buildStats: indexData?.buildStats || null,
        }
      } catch (e) {
        indexInfo = { error: "Failed to parse index" }
      }
    }

    return {
      exists: true,
      totalFiles: mdxFiles.length,
      indexExists,
      indexInfo,
      cacheStats: getCacheStats(),
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}
