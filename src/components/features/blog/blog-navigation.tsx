"use client"

import React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { generateBlogUrlFromDateAndSlug } from "@/lib/blog"

interface BlogPost {
  slug: string
  title: string
  excerpt?: string
  date?: string
}

interface BlogNavigationProps {
  previousPost?: BlogPost
  nextPost?: BlogPost
  className?: string
}

export function BlogNavigation({
  previousPost,
  nextPost,
  className = "",
}: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <div
      className={`p-8 lg:p-10 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-500 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Previous Post */}
        {previousPost ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={
                previousPost.date
                  ? generateBlogUrlFromDateAndSlug(
                      previousPost.date,
                      previousPost.slug
                    )
                  : `/blog/${previousPost.slug}`
              }
              className="group block"
            >
              <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all duration-300 min-h-[44px]">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 mb-1">Previous Article</p>
                  <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {previousPost.title}
                  </h3>
                  {previousPost.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {previousPost.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div></div>
        )}

        {/* Next Post */}
        {nextPost ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:text-right"
          >
            <Link
              href={
                nextPost.date
                  ? generateBlogUrlFromDateAndSlug(nextPost.date, nextPost.slug)
                  : `/blog/${nextPost.slug}`
              }
              className="group block"
            >
              <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all duration-300 md:flex-row-reverse md:text-right min-h-[44px]">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 mb-1">Next Article</p>
                  <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {nextPost.title}
                  </h3>
                  {nextPost.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {nextPost.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default BlogNavigation
