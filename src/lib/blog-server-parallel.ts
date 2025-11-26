import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { BlogPost } from "./blog"

const postsDirectory = path.join(process.cwd(), "content/blogs")
const cacheDir = path.join(process.cwd(), ".blog-cache")

// In-memory cache for faster access
let postsCache: BlogPost[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = process.env.NODE_ENV === "development" ? 30000 : 300000 // 30s dev, 5min prod

export function getAllPostsServer(): BlogPost[] {
  // Use in-memory cache if available and not expired
  const now = Date.now()
  if (postsCache && now - cacheTimestamp < CACHE_TTL) {
    return postsCache
  }

  // Try to load from parallel processing cache first
  const indexPath = path.join(cacheDir, "index.json")
  if (fs.existsSync(indexPath)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      postsCache = cacheData.posts.map((post: any) => ({
        ...post,
        // We don't store content in the index for performance
        content: "", // Will be loaded on-demand
      }))
      cacheTimestamp = now
      console.log(
        `[BLOG] Loaded ${postsCache.length} posts from parallel cache`
      )
      return postsCache
    } catch (error) {
      console.warn(
        "Failed to load parallel blog cache, falling back to file system"
      )
    }
  }

  // Fallback to direct file system reading (slower)
  console.log("[BLOG] Loading posts from file system (no cache available)")
  return getAllPostsFromFS()
}

function getAllPostsFromFS(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName): BlogPost => {
      const slug = fileName.replace(/\.mdx$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)

      return {
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
      }
    })

  const sorted = allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  postsCache = sorted
  cacheTimestamp = Date.now()

  return sorted
}

export function getPostBySlugServer(slug: string): BlogPost | null {
  // First try to get from parallel cache
  const cacheFilePath = path.join(cacheDir, `${slug}.json`)
  if (fs.existsSync(cacheFilePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFilePath, "utf8"))
      return {
        slug: cached.slug,
        title: cached.title,
        excerpt: cached.excerpt,
        date: cached.date,
        image: cached.image,
        readTime: cached.readTime,
        keywords: cached.keywords,
        content: cached.content, // Content is now cached
      }
    } catch (error) {
      console.warn(
        `Failed to load cached post ${slug}, falling back to file system`
      )
    }
  }

  // Fallback to file system
  return getPostFromFS(slug)
}

function getPostContentFromFS(slug: string): string {
  const fullPath = path.join(postsDirectory, slug + ".mdx")
  if (!fs.existsSync(fullPath)) return ""

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const matterResult = matter(fileContents)
  return matterResult.content
}

function getPostFromFS(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, slug + ".mdx")

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const matterResult = matter(fileContents)

  return {
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
  }
}

export function getAdjacentPosts(currentSlug: string) {
  const posts = getAllPostsServer()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
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
        }
      : null,
    nextPost: nextPost
      ? {
          slug: nextPost.slug,
          title: nextPost.title,
          excerpt: nextPost.excerpt,
        }
      : null,
  }
}

// Function to check if post is cached (for faster metadata access)
export function isPostCached(slug: string): boolean {
  const cacheFilePath = path.join(cacheDir, `${slug}.json`)
  return fs.existsSync(cacheFilePath)
}
