import Navigation from "@/components/layout/navigation/navigation"
import Footer from "@/components/layout/footer/footer"
import Head from "next/head"
import Image from "next/image"
import { BlogPost, generateBlogUrl } from "@/lib/blog"
import { BlogPostSchema } from "@/components/common/schema/BlogPostSchema"
import { GoogleReviewsSection } from "@/components/features/comments/google-reviews-section"
import { ReadingProgressBar } from "@/components/features/blog/reading-progress-bar"
import { BlogNavigation } from "@/components/features/blog/blog-navigation"
import Breadcrumb from "@/components/common/breadcrumb/breadcrumb"
import RelatedPosts from "@/components/features/blog/related-posts"

interface BlogLayoutProps {
  post: BlogPost
  children: React.ReactNode
  previousPost?: { slug: string; title: string; excerpt?: string } | null
  nextPost?: { slug: string; title: string; excerpt?: string } | null
  relatedPosts?: BlogPost[]
}

export default function BlogLayout({
  post,
  children,
  previousPost,
  nextPost,
  relatedPosts,
}: BlogLayoutProps) {
  return (
    <>
      <Head>
        <meta name="description" content={post.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Narkin's Builders" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Head>

      {/* ADD THIS SCHEMA COMPONENT */}
      <BlogPostSchema
        title={post.title}
        excerpt={post.excerpt}
        date={post.date}
        image={post.image}
        url={`https://www.narkinsbuilders.com${generateBlogUrl(post)}`}
      />

      <ReadingProgressBar />
      <Navigation />

      <article className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-neutral-50 to-white py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb
                items={[{ label: "Blog", href: "/blog" }]}
                currentPage={post.title}
              />
            </div>

            <div className="text-center">
              {/* Meta Info */}
              <div className="flex items-center justify-center gap-x-4 text-sm mb-6">
                <time className="text-gray-500">
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
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{post.readTime}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  By{" "}
                  <a
                    href="https://www.otherdev.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {post.author || "Other Dev"}
                  </a>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl tracking-tight text-gray-900 sm:text-4xl lg:text-5xl mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg sm:text-xl leading-7 sm:leading-8 text-gray-600 max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 pb-16">
          <div
            className="prose-blog max-w-none
      prose-headings:text-gray-900 prose-headings: prose-headings:leading-tight
      prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:transition-colors prose-a:duration-200
      prose-img:rounded-xl prose-img:shadow-lg prose-img:cursor-zoom-in prose-img:transition-transform prose-img:duration-300 prose-img:hover:scale-[1.02]
      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto
      prose-strong:text-gray-900 prose-strong:
      prose-em:text-gray-700 prose-em:italic"
          >
            {children}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
        </div>

        {/* Related Posts Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}

        {/* Reviews Section */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <GoogleReviewsSection blogSlug={post.slug} />
        </div>
      </article>

      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </>
  )
}
