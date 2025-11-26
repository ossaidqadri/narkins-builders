import { BlogPost } from "./blog"
import { BlogFilters } from "../components/features/blog-filter/blog-filter"

// Categorize blog posts based on title and keywords
export function categorizePost(post: BlogPost): string {
  const title = post.title.toLowerCase()
  const keywords = post.keywords?.toLowerCase() || ""

  // Investment Guides
  if (
    title.includes("investment") ||
    title.includes("roi") ||
    title.includes("returns") ||
    title.includes("strategy") ||
    keywords.includes("investment") ||
    keywords.includes("roi") ||
    keywords.includes("returns") ||
    keywords.includes("appreciation")
  ) {
    return "investment-guides"
  }

  // Buyer Guides
  if (
    title.includes("guide") ||
    title.includes("buying") ||
    title.includes("complete") ||
    title.includes("first-time") ||
    title.includes("buyer") ||
    keywords.includes("guide") ||
    keywords.includes("buying") ||
    keywords.includes("first-time buyer") ||
    keywords.includes("how to")
  ) {
    return "buyer-guides"
  }

  // Market Analysis (default for analysis-focused content)
  return "market-analysis"
}

// Get read time category
export function getReadTimeCategory(readTime: string): string {
  const minutes = parseInt(readTime.match(/\d+/)?.[0] || "0")
  return minutes <= 7 ? "quick" : "detailed"
}

// Filter and sort blog posts
export function filterAndSortPosts(
  posts: BlogPost[],
  filters: BlogFilters
): BlogPost[] {
  let filteredPosts = [...posts]

  // Filter by content type
  if (filters.contentType !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => categorizePost(post) === filters.contentType
    )
  }

  // Filter by read time
  if (filters.readTime !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => getReadTimeCategory(post.readTime) === filters.readTime
    )
  }

  // Sort by date
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return filters.sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  return filteredPosts
}

// Get filter statistics
export function getFilterStats(posts: BlogPost[]) {
  const stats = {
    total: posts.length,
    contentTypes: {
      "investment-guides": 0,
      "market-analysis": 0,
      "buyer-guides": 0,
    },
    readTimes: {
      quick: 0,
      detailed: 0,
    },
  }

  posts.forEach((post) => {
    const contentType = categorizePost(post)
    const readTimeCategory = getReadTimeCategory(post.readTime)

    stats.contentTypes[contentType as keyof typeof stats.contentTypes]++
    stats.readTimes[readTimeCategory as keyof typeof stats.readTimes]++
  })

  return stats
}
