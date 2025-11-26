// src/pages/blog/[year]/[month]/[slug].tsx

import { GetStaticPaths, GetStaticProps } from "next"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import {
  getAdjacentPosts,
  getPostBySlugServer,
  getPrecompiledMDX,
  hasPrecompiledMDX,
} from "../../../../lib/blog-server-precompiled"
import type { BlogPost } from "../../../../lib/blog"
import { getRelatedPosts } from "../../../../lib/related-posts"
import BlogLayout from "@/components/features/blog/blog-layout"
import components from "@/components/features/blog/mdx-components"
import remarkGfm from "remark-gfm"
import { useRouter } from "next/router"
import Head from "next/head"
import SocialShare from "@/components/features/social-share/social-share"

interface BlogPostProps {
  post: BlogPost
  mdxSource: MDXRemoteSerializeResult
  previousPost?: { slug: string; title: string; excerpt?: string } | null
  nextPost?: { slug: string; title: string; excerpt?: string } | null
  relatedPosts?: BlogPost[]
}

export default function BlogPost({
  post,
  mdxSource,
  previousPost,
  nextPost,
  relatedPosts,
}: BlogPostProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { year, month, slug } = router.query
  const canonicalUrl = `https://www.narkinsbuilders.com/blog/${year}/${month}/${slug}`
  const imageUrl = post.image
    ? `https://www.narkinsbuilders.com${post.image}`
    : "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo.webp"

  // Generate dynamic OG image URL
  const ogImageUrl = `https://www.narkinsbuilders.com/api/og/${slug}?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.date)}&readTime=${encodeURIComponent(post.readTime)}`

  // Calculate word count from content
  const wordCount = post.content
    ? post.content.split(/\s+/).filter(Boolean).length
    : 0

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Organization",
      name: "Narkin's Builders and Developers",
      url: "https://www.narkinsbuilders.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Narkin's Builders",
      logo: {
        "@type": "ImageObject",
        url: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo.webp",
        width: 600,
        height: 60,
      },
    },
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    articleBody: post.content
      ? post.content.substring(0, 5000)
      : post.excerpt || "",
    wordCount: wordCount,
    keywords:
      post.keywords ||
      "Bahria Town Karachi, luxury apartments, real estate investment",
    articleSection: "Real Estate",
    inLanguage: "en-US",
    isAccessibleForFree: true,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.narkinsbuilders.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.narkinsbuilders.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Narkin's Builders and Developers",
    url: "https://www.narkinsbuilders.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo.webp",
      width: 600,
      height: 60,
    },
    sameAs: [
      "https://www.facebook.com/narkinsbuilders",
      "https://www.instagram.com/narkinsbuilders",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-320-3243970",
      contactType: "Sales",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.narkinsbuilders.com",
    name: "Narkin's Builders",
    description:
      "Premium apartments in Bahria Town Karachi with flexible payment plans",
    publisher: {
      "@type": "Organization",
      name: "Narkin's Builders",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.narkinsbuilders.com/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <Head>
        <title>
          {Array.isArray(post.title)
            ? post.title.join(" ")
            : String(post.title || "")}{" "}
          | Narkin's Builders Blog
        </title>
        <meta name="description" content={post.excerpt || ""} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Narkin's Builders and Developers" />
        <meta name="copyright" content="Narkin's Builders and Developers" />
        <meta name="generator" content="Next.js" />
        <meta
          name="keywords"
          content={
            post.keywords ||
            "Bahria Town Karachi, luxury apartments, real estate investment, property development, Narkin's Builders"
          }
        />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Narkin's Builders Blog RSS Feed"
          href="https://www.narkinsbuilders.com/rss.xml"
        />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:site_name" content="Narkin's Builders" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ""} />
        <meta name="twitter:image" content={ogImageUrl} />

        <meta property="article:published_time" content={post.date} />
        <meta
          property="article:modified_time"
          content={post.lastModified || post.date}
        />
        <meta
          property="article:author"
          content="Narkin's Builders and Developers"
        />
        <meta property="article:section" content="Real Estate" />
        <meta property="article:tag" content="Bahria Town Karachi" />
        <meta property="article:tag" content="Real Estate Investment" />
        <meta property="article:tag" content="Property Development" />
        {post.keywords &&
          post.keywords
            .split(",")
            .slice(0, 10)
            .map((keyword: string, index: number) => (
              <meta
                key={`keyword-${index}`}
                property="article:tag"
                content={keyword.trim()}
              />
            ))}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <BlogLayout
        post={post}
        previousPost={previousPost}
        nextPost={nextPost}
        relatedPosts={relatedPosts}
      >
        <div className="prose prose-lg max-w-none mx-auto">
          <MDXRemote {...mdxSource} components={components} />
        </div>
        <div className="mt-8">
          <SocialShare url={canonicalUrl} title={post.title} />
        </div>
      </BlogLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Import here to avoid build issues
  const {
    getAllPostsServer,
  } = require("../../../../lib/blog-server-precompiled")

  try {
    // Get all posts dynamically
    const posts = getAllPostsServer()
    const paths = posts.map((post: any) => {
      const date = new Date(post.date)
      const year = date.getFullYear().toString()
      const month = String(date.getMonth() + 1).padStart(2, "0")

      return {
        params: {
          year,
          month,
          slug: post.slug,
        },
      }
    })

    return {
      paths,
      fallback: false, // Pre-build all pages to avoid issues
    }
  } catch (error) {
    console.error("Error getting blog paths:", error)
    return {
      paths: [],
      fallback: false,
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.slug || !params.year || !params.month) {
    return {
      notFound: true,
    }
  }

  const slug = params.slug as string

  try {
    const post = getPostBySlugServer(slug)

    if (!post) {
      return {
        notFound: true,
      }
    }

    // Verify the date matches the URL structure
    const postDate = new Date(post.date)
    const expectedYear = postDate.getFullYear().toString()
    const expectedMonth = String(postDate.getMonth() + 1).padStart(2, "0")

    if (params.year !== expectedYear || params.month !== expectedMonth) {
      return {
        notFound: true,
      }
    }

    let mdxSource: MDXRemoteSerializeResult

    // Try to use precompiled MDX first
    if (hasPrecompiledMDX(slug)) {
      const precompiled = getPrecompiledMDX(slug)
      if (precompiled) {
        mdxSource = precompiled
      } else {
        // Fallback to runtime compilation
        mdxSource = await serialize(post.content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            development: process.env.NODE_ENV === "development",
          },
        })
      }
    } else {
      // Runtime compilation
      mdxSource = await serialize(post.content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          development: process.env.NODE_ENV === "development",
        },
      })
    }

    const { previousPost, nextPost } = getAdjacentPosts(slug)

    // Get all posts for related posts calculation
    const {
      getAllPostsServer,
    } = require("../../../../lib/blog-server-precompiled")
    const allPosts = getAllPostsServer()

    // Calculate related posts
    const relatedPosts = getRelatedPosts(post, allPosts, 3).map((p) => ({
      ...p,
      content: "", // Remove content to reduce payload
    }))

    return {
      props: {
        post: {
          ...post,
          content: "", // Don't send content to client since we have serialized MDX
        },
        mdxSource,
        previousPost,
        nextPost,
        relatedPosts,
      },
      revalidate: 3600, // Revalidate once per hour
    }
  } catch (error) {
    console.error("Error loading blog post:", error)
    return {
      notFound: true,
    }
  }
}
