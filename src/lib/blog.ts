// src/lib/blog.ts - Client-safe version
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  image: string
  content: string
  readTime: string
  lastModified?: string
  keywords?: string
  author?: string
}

// This will be populated by getStaticProps
export const blogPosts: BlogPost[] = []

// Utility functions that work on both client and server
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlugFromArray(
  posts: BlogPost[],
  slug: string
): BlogPost | null {
  return posts.find((post) => post.slug === slug) || null
}

// Generate blog URL in the new format /blog/year/month/slug
export function generateBlogUrl(post: BlogPost): string {
  const postDate = new Date(post.date)
  const year = postDate.getFullYear()
  const month = String(postDate.getMonth() + 1).padStart(2, "0")
  return `/blog/${year}/${month}/${post.slug}`
}

// Generate blog URL from date string and slug
export function generateBlogUrlFromDateAndSlug(
  dateString: string,
  slug: string
): string {
  const postDate = new Date(dateString)
  const year = postDate.getFullYear()
  const month = String(postDate.getMonth() + 1).padStart(2, "0")
  return `/blog/${year}/${month}/${slug}`
}
