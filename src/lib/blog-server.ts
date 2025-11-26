// src/lib/blog-server.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { BlogPost } from "./blog"

const postsDirectory = path.join(process.cwd(), "content/blogs")

// Helper function to recursively read MDX files from nested directories
function readMDXFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      files.push(...readMDXFiles(itemPath))
    } else if (item.endsWith(".mdx")) {
      files.push(itemPath)
    }
  }

  return files
}

export type BlogFilter = "all" | "hcr" | "nbr" | "general"

export function getAllPostsServer(filter: BlogFilter = "all"): BlogPost[] {
  const allMDXFiles = readMDXFiles(postsDirectory)

  const allPostsData = allMDXFiles.map((fullPath): BlogPost => {
    const relativePath = path.relative(postsDirectory, fullPath)
    const slug = path.basename(fullPath, ".mdx")
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)
    const content = matterResult.content

    return {
      slug,
      title: matterResult.data.title || "Untitled",
      excerpt: matterResult.data.excerpt || "",
      date: matterResult.data.date
        ? new Date(matterResult.data.date).toISOString()
        : new Date().toISOString(),
      image: matterResult.data.image || "/images/narkins-builders-logo.webp",
      content: content,
      readTime: matterResult.data.readTime || "5 min read",
      keywords: matterResult.data.keywords || "",
    }
  })

  // Sort by date first
  const sortedPosts = allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Apply filter
  if (filter === "all") {
    return sortedPosts
  }

  return sortedPosts.filter((post) => {
    const searchText =
      `${post.title} ${post.excerpt} ${post.keywords} ${post.content}`.toLowerCase()

    switch (filter) {
      case "hcr":
        return searchText.includes("hill crest") || searchText.includes("hcr")
      case "nbr":
        return (
          searchText.includes("narkins boutique") ||
          searchText.includes("boutique residency") ||
          searchText.includes("nbr")
        )
      case "general":
        // General posts - exclude specific project mentions
        return (
          !searchText.includes("hill crest") &&
          !searchText.includes("hcr") &&
          !searchText.includes("narkins boutique") &&
          !searchText.includes("boutique residency") &&
          !searchText.includes("nbr")
        )
      default:
        return true
    }
  })
}

export function getPostBySlugServer(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, slug + ".mdx")

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const matterResult = matter(fileContents)

  const content = matterResult.content

  return {
    slug,
    title: matterResult.data.title || "Untitled",
    excerpt: matterResult.data.excerpt || "",
    date: matterResult.data.date
      ? new Date(matterResult.data.date).toISOString()
      : new Date().toISOString(),
    image: matterResult.data.image || "/images/narkins-builders-logo.webp",
    content: content,
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
