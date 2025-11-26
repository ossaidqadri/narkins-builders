const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Build optimizations
  experimental: {
    optimizePackageImports: ["antd", "@ant-design/plots", "@ant-design/icons"],
  },
  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      // CSS modules for Turbopack
      "*.module.css": {
        loaders: ["css-loader"],
        as: "*.module.css",
      },
      // SCSS modules for Turbopack
      "*.module.scss": {
        loaders: ["sass-loader", "css-loader"],
        as: "*.module.css",
      },
      // Handle SVG files
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "@": "./src",
      "@/components": "./src/components",
      "@/lib": "./src/lib",
      "@/styles": "./src/styles",
    },
  },
  transpilePackages: [
    "antd",
    "@ant-design/plots",
    "@ant-design/icons",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-table",
    "rc-tree",
    "rc-tooltip",
    "rc-select",
    "rc-menu",
    "rc-dropdown",
    "rc-input",
    "rc-textarea",
    "rc-checkbox",
    "rc-radio",
    "rc-switch",
    "rc-slider",
    "rc-progress",
    "rc-upload",
    "rc-steps",
    "rc-tabs",
    "rc-collapse",
    "rc-drawer",
    "rc-modal",
    "rc-notification",
    "rc-message",
    "rc-tooltip",
    "rc-popover",
    "rc-popconfirm",
    "@rc-component/util",
    "@rc-component/color-picker",
    "@rc-component/trigger",
    "@rc-component/portal",
    "@rc-component/motion",
  ],
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Handle Ant Design ESM modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })

    // Production build optimizations
    if (!dev) {
      // Enable parallel processing
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Better chunk splitting for blog components
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          antd: {
            name: "antd",
            test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
            priority: 20,
          },
          charts: {
            name: "charts",
            test: /[\\/]node_modules[\\/]@ant-design[\\/]plots[\\/]/,
            priority: 30,
          },
          mdx: {
            name: "mdx",
            test: /[\\/]node_modules[\\/](next-mdx-remote|remark|rehype)[\\/]/,
            priority: 25,
          },
        },
      }
    }

    return config
  },
  // Enhanced Security headers for SEO and performance
  async headers() {
    const isDev = process.env.NODE_ENV === "development"
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Disable caching in development for fresh updates
          ...(isDev
            ? [
                {
                  key: "Cache-Control",
                  value: "no-cache, no-store, must-revalidate",
                },
              ]
            : []),
        ],
      },
      // API routes caching
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
          },
        ],
      },
      // RSS and Sitemap - longer cache for stable content
      {
        source: "/api/(rss|sitemap).(xml|txt)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400",
          },
        ],
      },
      // Blog images - moderate cache with faster updates
      {
        source: "/images/blog-images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=7200, s-maxage=14400, stale-while-revalidate=86400",
          },
        ],
      },
      // Blog pages - moderate caching with revalidation
      {
        source: "/blog/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Static chunks - long-term caching for immutable assets
      {
        source: "/_next/static/chunks/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Other static assets - long-term caching
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/rss.xml",
        destination: "/api/rss.xml",
      },
    ]
  },
  async redirects() {
    return [
      // Redirect non-www to www (301 Permanent for SEO)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "narkinsbuilders.com",
          },
        ],
        destination: "https://www.narkinsbuilders.com/:path*",
        permanent: true,
      },
      // Redirect admin subdomain to main site (301 Permanent)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.narkinsbuilders.com",
          },
        ],
        destination: "https://www.narkinsbuilders.com/:path*",
        permanent: true,
      },
      {
        source:
          "/blog/bahria-town-uncertainty-smart-investors-choose-established-developers-2025",
        destination: "/blog/bahria-town-shutdown-scare-investment-security",
        permanent: true,
      },
      // Redirect old blog URLs to new date-based structure
      {
        source: "/blog/apartments-for-sale-bahria-town-karachi-2025",
        destination:
          "/blog/2025/01/apartments-for-sale-bahria-town-karachi-2025",
        permanent: true,
      },
      {
        source: "/blog/luxury-apartments-bahria-town-investment-guide",
        destination:
          "/blog/2025/02/luxury-apartments-bahria-town-investment-guide",
        permanent: true,
      },
      {
        source: "/blog/2-bedroom-apartments-bahria-town-karachi-guide",
        destination:
          "/blog/2025/03/2-bedroom-apartments-bahria-town-karachi-guide",
        permanent: true,
      },
      {
        source: "/blog/infrastructure-impact-karachi-property-values-2025",
        destination:
          "/blog/2025/04/infrastructure-impact-karachi-property-values-2025",
        permanent: true,
      },
      {
        source: "/blog/buying-apartment-bahria-town-first-time-buyer-guide",
        destination:
          "/blog/2025/05/buying-apartment-bahria-town-first-time-buyer-guide",
        permanent: true,
      },
      {
        source: "/blog/bahria-town-karachi-property-investment-guide",
        destination:
          "/blog/2025/06/bahria-town-karachi-property-investment-guide",
        permanent: true,
      },
      {
        source: "/blog/gated-communities-karachi-investment-strategy-2025",
        destination:
          "/blog/2025/07/gated-communities-karachi-investment-strategy-2025",
        permanent: true,
      },
      {
        source: "/blog/vertical-development-karachi-apartments-vs-houses-2025",
        destination:
          "/blog/2025/07/vertical-development-karachi-apartments-vs-houses-2025",
        permanent: true,
      },
      {
        source: "/blog/bahria-town-karachi-pricing-analysis-2025",
        destination: "/blog/2025/07/bahria-town-karachi-pricing-analysis-2025",
        permanent: true,
      },
      {
        source: "/blog/karachi-real-estate-market-recovery-july-2025",
        destination:
          "/blog/2025/07/karachi-real-estate-market-recovery-july-2025",
        permanent: true,
      },
      {
        source: "/blog/emerging-neighborhoods-karachi-investment-hotspots-2025",
        destination:
          "/blog/2025/08/emerging-neighborhoods-karachi-investment-hotspots-2025",
        permanent: true,
      },
      {
        source: "/blog/bahria-town-karachi-prices-drop-buying-opportunity-2025",
        destination:
          "/blog/2025/08/bahria-town-karachi-prices-drop-buying-opportunity-2025",
        permanent: true,
      },
      {
        source:
          "/blog/sustainable-smart-living-green-building-trends-bahria-town-2025",
        destination:
          "/blog/2025/08/sustainable-smart-living-green-building-trends-bahria-town-2025",
        permanent: true,
      },
      {
        source:
          "/blog/dha-vs-bahria-town-vs-gulshan-luxury-living-comparison-2025",
        destination:
          "/blog/2025/08/dha-vs-bahria-town-vs-gulshan-luxury-living-comparison-2025",
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "admin.narkinsbuilders.com",
        port: "",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "narkinsbuilders.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
              port: "3000",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
