import { BlogPost } from "./blog"

/**
 * Calculate content similarity between two blog posts
 * Based on keywords, title words, and excerpt overlap
 */
function calculateSimilarity(post1: BlogPost, post2: BlogPost): number {
  let score = 0

  // Extract keywords from both posts
  const keywords1 = extractKeywords(post1)
  const keywords2 = extractKeywords(post2)

  // Calculate keyword overlap (highest weight)
  const keywordOverlap = keywords1.filter((k) => keywords2.includes(k)).length
  score += keywordOverlap * 3

  // Calculate title word overlap
  const titleWords1 = extractWords(post1.title)
  const titleWords2 = extractWords(post2.title)
  const titleOverlap = titleWords1.filter((w) => titleWords2.includes(w)).length
  score += titleOverlap * 2

  // Calculate excerpt word overlap (lower weight)
  const excerptWords1 = extractWords(post1.excerpt || "")
  const excerptWords2 = extractWords(post2.excerpt || "")
  const excerptOverlap = excerptWords1.filter((w) =>
    excerptWords2.includes(w)
  ).length
  score += excerptOverlap * 1

  return score
}

/**
 * Extract keywords from a blog post
 */
function extractKeywords(post: BlogPost): string[] {
  const keywords: string[] = []

  // From keywords field
  if (post.keywords) {
    const keywordList = post.keywords
      .toLowerCase()
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
    keywords.push(...keywordList)
  }

  // Common real estate keywords from title
  const realEstateKeywords = [
    "bahria town",
    "karachi",
    "lahore",
    "islamabad",
    "apartment",
    "property",
    "investment",
    "housing",
    "real estate",
    "dha",
    "gulshan",
    "construction",
    "development",
    "financing",
    "fbr",
    "rda",
    "sbca",
    "proptech",
  ]

  const titleLower = post.title.toLowerCase()
  realEstateKeywords.forEach((keyword) => {
    if (titleLower.includes(keyword)) {
      keywords.push(keyword)
    }
  })

  return [...new Set(keywords)]
}

/**
 * Extract significant words from text (excluding stop words)
 */
function extractWords(text: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
    "what",
    "how",
    "why",
    "when",
    "where",
    "which",
    "who",
    "your",
    "you",
    "we",
    "our",
  ])

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
}

/**
 * Get related posts for a given blog post
 * @param currentPost - The current blog post
 * @param allPosts - All available blog posts
 * @param limit - Number of related posts to return (default: 3)
 * @returns Array of related blog posts sorted by relevance
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug)

  // Calculate similarity scores
  const postsWithScores = otherPosts.map((post) => ({
    post,
    score: calculateSimilarity(currentPost, post),
  }))

  // Sort by score (descending) and recency (newer posts preferred for equal scores)
  postsWithScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    // If scores are equal, prefer newer posts
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
  })

  // Return top N posts
  return postsWithScores.slice(0, limit).map((item) => item.post)
}
