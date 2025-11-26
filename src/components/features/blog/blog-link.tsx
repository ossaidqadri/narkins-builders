// Helper component for linking to blog posts
// Usage: <BlogLink slug="hill-crest-investment-guide">Read our investment guide</BlogLink>

import Link from "next/link"
import { ReactNode } from "react"

interface BlogLinkProps {
  slug: string
  children: ReactNode
  className?: string
}

export default function BlogLink({
  slug,
  children,
  className = "",
}: BlogLinkProps) {
  return (
    <Link href={`/blog/${slug}`} className={className}>
      {children}
    </Link>
  )
}

// Export for easy importing
export { BlogLink }
