import Link from "next/link"
import Image from "next/image"
import React from "react"

interface Author {
  name: string
  role?: string
  imageUrl?: string
}

interface Post {
  id?: number
  slug?: string
  title: string
  link?: string
  date: string
  datetime?: string
  description?: string
  excerpt?: string
  category: string
  author?: Author
  image?: string
}

interface BlogsSectionProps {
  posts: Post[]
}

const BlogsSection: React.FC<BlogsSectionProps> = ({ posts }) => {
  // Define the newest blogs that have image loading issues
  const newestBlogImages = [
    "/media/common/blog/gated-community-karachi.webp",
    "/media/common/blog/karachi-brt-development.webp",
    "/media/common/blog/karachi-skyline-2025.webp",
    "/media/common/blog/luxury-apartments-bahria-town-night-view.webp",
    "/media/common/blog/karachi-high-rise-skyline.webp",
  ]

  // Check if this is a problematic new blog image
  const isNewBlogImage = (imagePath: string) =>
    newestBlogImages.includes(imagePath)

  // Handle empty posts
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
              From our blog
            </h2>
            <p className="mt-4 text-lg text-neutral-700">
              Blog posts coming soon...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
            From our blog
          </h2>
          <p className="mt-4 text-lg text-neutral-700 mx-auto">
            Latest insights on real estate investment in Bahria Town
          </p>
        </div>

        {/* ✅ FIXED: Improved responsive grid layout */}
        <div className="mx-auto grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:mx-0 lg:max-w-none">
          {posts.map((post, index) => (
            <article
              key={post.id || post.slug || index}
              className="bg-white border border-gray-100 rounded-xl flex flex-col justify-between hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
            >
              {/* Blog Image */}
              {post.image && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority={index < 3}
                    onError={(e) => {
                      console.error(
                        "Failed to load blog section image:",
                        post.image
                      )
                      // Fallback to default image
                      const target = e.target as HTMLImageElement
                      target.src =
                        "/media/common/logos/narkins-builders-logo.webp"
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={isNewBlogImage(post.image)}
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-x-4 text-xs mb-4 min-h-[24px]">
                  <time
                    dateTime={post.datetime || post.date}
                    className="text-gray-500"
                  >
                    {(() => {
                      try {
                        return new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })
                      } catch (error) {
                        return "Date unavailable"
                      }
                    })()}
                  </time>
                  <span className="bg-black text-white px-3 py-1.5 rounded-full text-xs">
                    {post.category || "Real Estate"}
                  </span>
                </div>

                <div className="group relative flex-grow">
                  <h3 className="text-xl leading-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                    <Link href={post.link || `/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  {/* ✅ FIXED: Proper HTML regex to remove tags */}
                  <p className="line-clamp-3 text-base leading-relaxed text-gray-600 mb-6">
                    {(post.description || post.excerpt || "").replace(
                      /<[^>]*>/g,
                      ""
                    )}
                  </p>
                </div>

                {post.author?.name && (
                  <div className="flex items-center gap-x-3 mt-4 pt-4 border-t border-gray-200">
                    {post.author.imageUrl && (
                      <Image
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        className="h-8 w-8 rounded-full bg-gray-50"
                        width={32}
                        height={32}
                      />
                    )}
                    <div className="text-sm">
                      <p className=" text-gray-900">{post.author.name}</p>
                      {post.author.role && (
                        <p className="text-gray-600">{post.author.role}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogsSection
