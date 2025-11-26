const fs = require("fs")
const path = require("path")

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Your website's domain
  siteUrl: "https://www.narkinsbuilders.com",

  // This will automatically generate a robots.txt file for you
  generateRobotsTxt: true,

  // (Optional) If you have any pages you want to exclude from the sitemap
  exclude: ["/api/*", "/admin/*", "/admin-tina"],

  // Additional paths to include (for pages not in build output yet)
  additionalPaths: async (config) => [
    {
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/blog",
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/hill-crest-residency",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/narkins-boutique-residency",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/completed-projects",
      changefreq: "monthly",
      priority: 0.6,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/about",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
  ],

  // This is the most important part. It dynamically corrects the settings for each page.
  transform: async (config, urlPath) => {
    // Homepage - Highest priority
    if (urlPath === "/") {
      return {
        loc: urlPath,
        changefreq: "daily",
        priority: 1.0, // Maximum priority for homepage
        lastmod: new Date().toISOString(),
      }
    }

    // Property pages - Very high priority (money pages)
    if (
      urlPath === "/hill-crest-residency" ||
      urlPath === "/narkins-boutique-residency"
    ) {
      return {
        loc: urlPath,
        changefreq: "weekly",
        priority: 0.9, // Very high priority for conversion pages
        lastmod: new Date().toISOString(),
      }
    }

    // Blog listing page
    if (urlPath === "/blog") {
      return {
        loc: urlPath,
        changefreq: "daily",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }

    // Individual blog posts - Use actual file modification dates
    if (urlPath.startsWith("/blog/")) {
      try {
        // Extract year, month, and slug from URL path
        // Format: /blog/2025/10/slug-name
        const urlParts = urlPath.split("/").filter(Boolean) // ['blog', '2025', '10', 'slug-name']

        if (urlParts.length >= 4) {
          const year = urlParts[1]
          const month = urlParts[2]
          const slug = urlParts.slice(3).join("/") // Handle multi-part slugs

          // Map month number to folder name (e.g., '10' -> '10-october')
          const monthMap = {
            "01": "01-january",
            "02": "02-february",
            "03": "03-march",
            "04": "04-april",
            "05": "05-may",
            "06": "06-june",
            "07": "07-july",
            "08": "08-august",
            "09": "09-september",
            10: "10-october",
            11: "11-november",
            12: "12-december",
          }

          const monthFolder = monthMap[month]
          const filePath = path.join(
            process.cwd(),
            "content",
            "blogs",
            year,
            monthFolder,
            `${slug}.mdx`
          )

          // Get file modification time
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath)
            const fileModDate = stats.mtime.toISOString()

            // Calculate priority based on recency (October = 0.8, older = 0.7)
            const currentMonth = new Date().getMonth() + 1
            const blogMonth = parseInt(month)
            const isCurrentMonth = blogMonth === currentMonth
            const priority = isCurrentMonth ? 0.8 : 0.7

            return {
              loc: urlPath,
              changefreq: "weekly",
              priority: priority,
              lastmod: fileModDate, // Use actual file modification date
            }
          }
        }
      } catch (error) {
        console.error(`Error getting file stats for ${urlPath}:`, error.message)
      }

      // Fallback for blog posts if file not found
      return {
        loc: urlPath,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }

    // Default settings for all other pages
    return {
      loc: urlPath,
      changefreq: config.changefreq || "monthly",
      priority: config.priority || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
