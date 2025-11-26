import Link from "next/link"
import Image from "next/image"
import { BlogPost, generateBlogUrl } from "@/lib/blog"

interface RelatedPostsProps {
  posts: BlogPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-gray-200 pt-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Related Articles
        </h2>
        <p className="text-gray-600">
          Continue reading about real estate investment and property development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const blogUrl = generateBlogUrl(post)
          const formattedDate = new Date(post.date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }
          )

          return (
            <Link
              key={post.slug}
              href={blogUrl}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date & Read Time */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <time dateTime={post.date}>{formattedDate}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Read More Link */}
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  Read Article
                  <svg
                    className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
