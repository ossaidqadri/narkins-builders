import React from "react"
import { BlogPost } from "../../../lib/blog"
import { getFilterStats } from "../../../lib/blog-filter"

export interface BlogFilters {
  contentType: string
  sortOrder: string
  readTime: string
}

interface BlogFilterProps {
  filters: BlogFilters
  onFiltersChange: (filters: BlogFilters) => void
  totalPosts: number
  filteredCount: number
  posts: BlogPost[]
}

export default function BlogFilter({
  filters,
  onFiltersChange,
  totalPosts,
  filteredCount,
  posts,
}: BlogFilterProps) {
  const stats = getFilterStats(posts)

  const handleFilterChange = (field: keyof BlogFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      contentType: "all",
      sortOrder: "newest",
      readTime: "all",
    })
  }

  const contentTypes = [
    { key: "all", label: "All Articles", count: totalPosts },
    {
      key: "investment-guides",
      label: "Investment Guides",
      count: stats.contentTypes["investment-guides"],
    },
    {
      key: "market-analysis",
      label: "Market Analysis",
      count: stats.contentTypes["market-analysis"],
    },
    {
      key: "buyer-guides",
      label: "Buyer Guides",
      count: stats.contentTypes["buyer-guides"],
    },
  ]

  const hasActiveFilters =
    filters.contentType !== "all" ||
    filters.sortOrder !== "newest" ||
    filters.readTime !== "all"

  return (
    <div className="space-y-4">
      {/* Content Type Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200 pb-4 min-w-max">
          {contentTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleFilterChange("contentType", type.key)}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                filters.contentType === type.key
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">{type.label}</span>
              <span className="sm:hidden">
                {type.label
                  .replace("Investment ", "")
                  .replace("Market ", "")
                  .replace("Buyer ", "")
                  .replace("All ", "")}
              </span>
              <span className="ml-1">({type.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filters & Results */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Read Time:</span>
            <select
              value={filters.readTime}
              onChange={(e) => handleFilterChange("readTime", e.target.value)}
              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="quick">Quick (≤7 min)</option>
              <option value="detailed">Detailed (8+ min)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing <span>{filteredCount}</span> of <span>{totalPosts}</span>{" "}
          articles
        </div>
      </div>
    </div>
  )
}
