// Import Workbox SW with improved error handling
let workboxLoaded = false

try {
  importScripts("/workbox-sw/workbox-sw.js")
  workboxLoaded = true
  console.log("Workbox loaded from local source")
} catch (e) {
  console.warn("Local Workbox import failed:", e.message)
  // Fallback to CDN if local import fails
  try {
    importScripts(
      "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js"
    )
    workboxLoaded = true
    console.log("Workbox loaded from CDN")
  } catch (cdnError) {
    console.error(
      "Failed to load Workbox from both local and CDN sources:",
      cdnError.message
    )
    workboxLoaded = false
  }
}

const CACHE_NAME = "narkins-builders-v11"
const STATIC_CACHE = "narkins-static-v10"
const RUNTIME_CACHE = "narkins-runtime-v10"

// Media cache buckets
const CACHE_BUCKETS = {
  CRITICAL_VIDEOS: "narkins-critical-videos-v9",
  DEMAND_VIDEOS: "narkins-demand-videos-v9",
  CRITICAL_IMAGES: "narkins-critical-images-v9",
  PROJECT_IMAGES: "narkins-project-images-v9",
  BLOG_IMAGES: "narkins-blog-images-v9",
}

// Storage limits (in bytes)
const STORAGE_LIMITS = {
  CRITICAL_VIDEOS: 10 * 1024 * 1024, // 10MB
  DEMAND_VIDEOS: 40 * 1024 * 1024, // 40MB
  CRITICAL_IMAGES: 20 * 1024 * 1024, // 20MB
  PROJECT_IMAGES: 50 * 1024 * 1024, // 50MB
  BLOG_IMAGES: 30 * 1024 * 1024, // 30MB
  TOTAL_LIMIT: 150 * 1024 * 1024, // 150MB max
}

// Media file categorization
const MEDIA_CATEGORIES = {
  CRITICAL_VIDEOS: [
    "/media/videos/hero/hero-bg.mp4",
    "/media/hcr/videos/hill_crest_compressed.mp4",
    "/media/videos/hero/C_Narkins_Exterior.mp4",
  ],
  LARGE_VIDEOS: [
    "/media/hcr/videos/hillcrest.mp4",
    "/media/nbr/videos/nbr.mp4",
    "/media/hcr/videos/Hill Crest 03-07-2023.mp4",
  ],
  CRITICAL_IMAGES: [
    "/media/common/logos/narkins-builders-logo.webp",
    "/default-avatar.webp",
    "/favicon.ico",
    "/icons/icon-192x192.svg",
    "/icons/icon-512x512.svg",
  ],
}

// Core pages and assets to precache
const urlsToCache = [
  "/",
  "/hill-crest-residency",
  "/narkins-boutique-residency",
  "/about",
  "/blog",
  "/completed-projects",
  "/manifest.json",
  "/offline.html",
  "/media/common/logos/narkins-builders-logo.webp",
  "/favicon.ico",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
]

// Initialize Workbox
if (workboxLoaded && typeof workbox !== "undefined" && workbox) {
  console.log("Initializing Workbox service worker")

  // Skip waiting and claim clients
  workbox.core.skipWaiting()
  workbox.core.clientsClaim()

  // Precache core assets including critical media
  const precacheAssets = [
    ...urlsToCache.map((url) => ({ url, revision: "7" })),
    ...MEDIA_CATEGORIES.CRITICAL_VIDEOS.map((url) => ({ url, revision: "7" })),
    ...MEDIA_CATEGORIES.CRITICAL_IMAGES.map((url) => ({ url, revision: "7" })),
  ]

  workbox.precaching.precacheAndRoute(precacheAssets)

  // Cache strategies for different content types

  // 1. HTML Pages - Stale While Revalidate (fast loading, fresh content)
  // This route is for pages that are not precached. Precaching is handled by precacheAndRoute.
  workbox.routing.registerRoute(
    ({ request, url }) => {
      // This runtime caching route should only apply to documents (HTML pages).
      if (request.destination !== "document") {
        return false
      }
      // We must not intercept requests for precached pages, so we check against the list.
      // The precache route has its own logic (cache-first).
      // This prevents the "Failed to fetch" error for precached pages when offline.
      const precachedPageUrls = [
        "/",
        "/hill-crest-residency",
        "/narkins-boutique-residency",
        "/about",
        "/blog",
        "/completed-projects",
        "/offline.html",
      ]
      return !precachedPageUrls.includes(url.pathname)
    },
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "pages-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 2. Blog Posts and TinaCMS Content - Stale While Revalidate
  workbox.routing.registerRoute(
    ({ url }) =>
      url.pathname.startsWith("/blog/") || url.pathname.includes("/api/"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "content-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 2a. TinaCMS Admin Interface - Network First (always fresh for editing)
  workbox.routing.registerRoute(
    ({ url }) =>
      url.pathname.startsWith("/admin") || url.pathname.includes("/admin-tina"),
    new workbox.strategies.NetworkFirst({
      cacheName: "tina-admin-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        }),
      ],
    })
  )

  // 2b. TinaCMS GraphQL and Database queries
  workbox.routing.registerRoute(
    ({ url }) =>
      url.pathname.includes("/api/graphql") ||
      url.pathname.includes("/api/tina") ||
      url.pathname.includes("/_vercel/speed-insights"),
    new workbox.strategies.NetworkFirst({
      cacheName: "tina-api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 60, // 30 minutes
        }),
      ],
    })
  )

  // 2c. Blog content files (MDX) - Cache First with revalidation
  workbox.routing.registerRoute(
    ({ url }) =>
      url.pathname.includes("/content/blogs/") ||
      url.pathname.includes("/content/faqs/"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "blog-content-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 3a. Critical Images - Cache First (precached, long-term)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === "image" &&
      MEDIA_CATEGORIES.CRITICAL_IMAGES.some((img) =>
        url.pathname.endsWith(img)
      ),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_BUCKETS.CRITICAL_IMAGES,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 3b. Project Images - Stale While Revalidate (amenities, floor plans, galleries)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === "image" &&
      (url.pathname.includes("/media/hcr/") ||
        url.pathname.includes("/media/nbr/") ||
        url.pathname.includes("/media/completed-projects/") ||
        url.pathname.includes("/media/about/") ||
        url.pathname.includes("/nbr-scaled/") ||
        url.pathname.includes("/hcr-scaled/") ||
        url.pathname.includes("/hcr/")) &&
      !MEDIA_CATEGORIES.CRITICAL_IMAGES.some((img) =>
        url.pathname.endsWith(img)
      ),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_BUCKETS.PROJECT_IMAGES,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 3c. Blog Images - Stale While Revalidate (faster updates)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === "image" &&
      url.pathname.includes("/media/common/blog/"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_BUCKETS.BLOG_IMAGES,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 3d. Other Images - Cache First (fallback for any other images)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === "image" &&
      !url.pathname.includes("/media/common/blog/") &&
      !url.pathname.includes("/media/hcr/") &&
      !url.pathname.includes("/media/nbr/") &&
      !url.pathname.includes("/media/completed-projects/") &&
      !url.pathname.includes("/media/about/") &&
      !url.pathname.includes("/nbr-scaled/") &&
      !url.pathname.includes("/hcr-scaled/") &&
      !url.pathname.includes("/hcr/") &&
      !MEDIA_CATEGORIES.CRITICAL_IMAGES.some((img) =>
        url.pathname.endsWith(img)
      ),
    new workbox.strategies.CacheFirst({
      cacheName: "images-other-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 4a. Critical Videos - Cache First (precached)
  workbox.routing.registerRoute(
    ({ url }) =>
      MEDIA_CATEGORIES.CRITICAL_VIDEOS.some((video) =>
        url.pathname.endsWith(video)
      ),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_BUCKETS.CRITICAL_VIDEOS,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 5,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  )

  // 4b. Large Videos - Smart caching based on engagement
  workbox.routing.registerRoute(
    ({ request, url }) => {
      return (
        request.destination === "video" &&
        !MEDIA_CATEGORIES.CRITICAL_VIDEOS.some((video) =>
          url.pathname.endsWith(video)
        )
      )
    },
    async ({ request, url }) => {
      const videoUrl = url.pathname

      // Track video view
      USER_ENGAGEMENT.trackVideoView(videoUrl)

      // Try cache first
      const cache = await caches.open(CACHE_BUCKETS.DEMAND_VIDEOS)
      const cachedResponse = await cache.match(request)

      if (cachedResponse) {
        return cachedResponse
      }

      // Fetch from network
      const networkResponse = await fetch(request)

      // Decide if we should cache based on engagement and storage
      const contentLength = networkResponse.headers.get("content-length")
      const fileSize = contentLength ? parseInt(contentLength) : 0

      if (
        (await shouldCache("DEMAND_VIDEOS")) &&
        USER_ENGAGEMENT.shouldCacheVideo(videoUrl, fileSize)
      ) {
        const responseClone = networkResponse.clone()
        cache.put(request, responseClone)
      }

      return networkResponse
    }
  )

  // 5. Static Assets (CSS, JS, Fonts) - Cache First
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "font",
    new workbox.strategies.CacheFirst({
      cacheName: "static-assets",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    })
  )

  // 6. External APIs - Network First (fresh data priority)
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === "https://admin.narkinsbuilders.com" ||
      url.origin === "https://sheets.googleapis.com",
    new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        }),
      ],
    })
  )

  // 7. Skip Facebook and tracking scripts entirely (bypass service worker)
  // This prevents errors when these scripts are blocked by ad blockers
  workbox.routing.registerRoute(
    ({ url }) =>
      url.hostname.includes("facebook.net") ||
      url.hostname.includes("connect.facebook.net") ||
      url.pathname.includes("fbevents.js") ||
      url.hostname.includes("google-analytics.com") ||
      url.hostname.includes("googletagmanager.com"),
    async ({ event }) => {
      // Let the browser handle these requests directly (bypass SW)
      return fetch(event.request).catch(
        () => new Response(null, { status: 200 })
      )
    }
  )
} else {
  // Fallback to basic service worker functionality
  console.log("Using fallback service worker - Workbox not available")

  self.addEventListener("install", (event) => {
    event.waitUntil(
      Promise.all([
        // Cache core pages and assets with error handling
        caches
          .open(CACHE_NAME)
          .then((cache) => {
            return cache
              .addAll(urlsToCache.filter((url) => url !== "/videoframe_0.webp"))
              .catch((err) => {
                console.warn("Failed to cache some core assets:", err)
              })
          }),
        // Cache critical videos with error handling
        caches
          .open(CACHE_BUCKETS.CRITICAL_VIDEOS)
          .then((cache) => {
            return Promise.allSettled(
              MEDIA_CATEGORIES.CRITICAL_VIDEOS.map((url) => cache.add(url))
            ).then((results) => {
              results.forEach((result, index) => {
                if (result.status === "rejected") {
                  console.warn(
                    `Failed to cache video ${MEDIA_CATEGORIES.CRITICAL_VIDEOS[index]}:`,
                    result.reason
                  )
                }
              })
            })
          }),
        // Cache critical images with error handling
        caches
          .open(CACHE_BUCKETS.CRITICAL_IMAGES)
          .then((cache) => {
            return Promise.allSettled(
              MEDIA_CATEGORIES.CRITICAL_IMAGES.map((url) => cache.add(url))
            ).then((results) => {
              results.forEach((result, index) => {
                if (result.status === "rejected") {
                  console.warn(
                    `Failed to cache image ${MEDIA_CATEGORIES.CRITICAL_IMAGES[index]}:`,
                    result.reason
                  )
                }
              })
            })
          }),
      ])
        .then(() => {
          console.log("Service worker installation completed")
          self.skipWaiting()
        })
        .catch((err) => {
          console.error("Service worker installation failed:", err)
        })
    )
  })

  // Enhanced fetch handler with offline fallbacks
  self.addEventListener("fetch", (event) => {
    // Only handle requests from our origin to avoid CORS issues
    if (!event.request.url.startsWith(self.location.origin)) {
      return
    }

    // Exclude Facebook and other tracking scripts from service worker
    const url = new URL(event.request.url)
    if (
      url.hostname.includes("facebook.net") ||
      url.hostname.includes("connect.facebook.net") ||
      event.request.url.includes("fbevents.js")
    ) {
      return
    }

    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("Serving from cache:", event.request.url)
          return response
        }

        // Try network first, then fallback
        return fetch(event.request)
          .then((networkResponse) => {
            // Clone the response before using it
            const responseClone = networkResponse.clone()

            // Cache successful responses
            if (networkResponse.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }

            return networkResponse
          })
          .catch(async (error) => {
            console.warn(
              "Network request failed:",
              event.request.url,
              error.message
            )
            const url = new URL(event.request.url)

            // Offline fallbacks for different content types
            if (event.request.destination === "document") {
              // Try to serve homepage from cache, then offline page
              const cachedHome = await caches.match("/")
              if (cachedHome) {
                return cachedHome
              }
              return (
                caches.match("/offline.html") ||
                new Response("Page unavailable offline", {
                  status: 503,
                  statusText: "Service Unavailable",
                  headers: { "Content-Type": "text/html" },
                })
              )
            }

            // Video fallbacks - try compressed version
            if (event.request.destination === "video") {
              if (url.pathname === "/media/hcr/videos/hillcrest.mp4") {
                return caches.match(
                  "/media/hcr/videos/hill_crest_compressed.mp4"
                )
              }
              if (url.pathname === "/media/nbr/videos/nbr.mp4") {
                return caches.match("/media/videos/hero/hero-bg.mp4")
              }
            }

            // Image fallbacks - try default avatar or logo
            if (event.request.destination === "image") {
              if (url.pathname.includes("/media/")) {
                const fallback =
                  (await caches.match("/default-avatar.webp")) ||
                  (await caches.match(
                    "/media/common/logos/narkins-builders-logo.webp"
                  ))
                if (fallback) return fallback
              }
            }

            // For other resources, just fail gracefully
            return new Response("Content unavailable offline", {
              status: 503,
              statusText: "Service Unavailable",
            })
          })
      })
    )
  })
}

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "lead-form-sync") {
    event.waitUntil(syncLeadForms())
  } else if (event.tag === "contact-form-sync") {
    event.waitUntil(syncContactForms())
  }
})

// Sync offline lead form submissions
async function syncLeadForms() {
  try {
    const db = await openDB()
    const tx = db.transaction(["leadForms"], "readonly")
    const store = tx.objectStore("leadForms")
    const forms = await store.getAll()

    for (const form of forms) {
      try {
        const response = await fetch("/api/sheets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.data),
        })

        if (response.ok) {
          // Remove from IndexedDB after successful sync
          const deleteTx = db.transaction(["leadForms"], "readwrite")
          await deleteTx.objectStore("leadForms").delete(form.id)
        }
      } catch (error) {}
    }
  } catch (error) {}
}

// Sync offline contact form submissions
async function syncContactForms() {
  try {
    const db = await openDB()
    const tx = db.transaction(["contactForms"], "readonly")
    const store = tx.objectStore("contactForms")
    const forms = await store.getAll()

    for (const form of forms) {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.data),
        })

        if (response.ok) {
          const deleteTx = db.transaction(["contactForms"], "readwrite")
          await deleteTx.objectStore("contactForms").delete(form.id)
        }
      } catch (error) {}
    }
  } catch (error) {}
}

// Storage quota monitoring functions
async function getStorageUsage() {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
        percentage: estimate.quota
          ? (estimate.usage / estimate.quota) * 100
          : 0,
      }
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 }
    }
  }
  return { used: 0, available: 0, percentage: 0 }
}

async function getCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    let totalSize = 0

    for (const request of keys) {
      const response = await cache.match(request)
      if (response && response.headers.get("content-length")) {
        totalSize += parseInt(response.headers.get("content-length"))
      }
    }
    return totalSize
  } catch (error) {
    return 0
  }
}

async function shouldCache(cacheType) {
  const usage = await getStorageUsage()
  const limit = STORAGE_LIMITS[cacheType] || STORAGE_LIMITS.TOTAL_LIMIT

  // Don't cache if we're over 90% of total limit
  if (usage.percentage > 90) {
    return false
  }

  // Check individual cache limits
  const cacheSize = await getCacheSize(CACHE_BUCKETS[cacheType])
  return cacheSize < limit
}

async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys()
    const oldCaches = cacheNames.filter(
      (name) => name.includes("narkins") && !name.includes("v7")
    )

    await Promise.all(oldCaches.map((cacheName) => caches.delete(cacheName)))
  } catch (error) {
    console.warn("Cache cleanup failed:", error)
  }
}

// User engagement tracking for intelligent caching
const USER_ENGAGEMENT = {
  videoViews: new Map(),
  videoInteractions: new Map(),

  trackVideoView(videoUrl) {
    const views = this.videoViews.get(videoUrl) || 0
    this.videoViews.set(videoUrl, views + 1)
  },

  trackVideoInteraction(videoUrl) {
    this.videoInteractions.set(videoUrl, Date.now())
  },

  shouldCacheVideo(videoUrl, fileSize) {
    const views = this.videoViews.get(videoUrl) || 0
    const hasInteracted = this.videoInteractions.has(videoUrl)

    // Always cache critical small videos
    if (MEDIA_CATEGORIES.CRITICAL_VIDEOS.includes(videoUrl)) return true

    // Cache based on file size and engagement
    if (fileSize < 5 * 1024 * 1024) return true // < 5MB
    if (fileSize < 15 * 1024 * 1024 && views > 0) return true // < 15MB and viewed
    if (fileSize >= 15 * 1024 * 1024 && hasInteracted) return true // >= 15MB and interacted

    return false
  },
}

// IndexedDB helper for offline form storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NarkinsOfflineDB", 2)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains("leadForms")) {
        db.createObjectStore("leadForms", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("contactForms")) {
        db.createObjectStore("contactForms", { keyPath: "id" })
      }

      // Store for user engagement tracking
      if (!db.objectStoreNames.contains("userEngagement")) {
        db.createObjectStore("userEngagement", { keyPath: "url" })
      }
    }
  })
}

// Cache warming and cleanup processes
async function warmCriticalCaches() {
  try {
    // Pre-warm critical video cache
    const criticalVideoCache = await caches.open(CACHE_BUCKETS.CRITICAL_VIDEOS)
    for (const videoUrl of MEDIA_CATEGORIES.CRITICAL_VIDEOS) {
      try {
        const response = await fetch(videoUrl, { method: "HEAD" })
        if (response.ok) {
          await criticalVideoCache.add(videoUrl)
        }
      } catch (error) {
        console.warn(`Failed to warm cache for ${videoUrl}:`, error)
      }
    }

    // Pre-warm critical image cache
    const criticalImageCache = await caches.open(CACHE_BUCKETS.CRITICAL_IMAGES)
    for (const imageUrl of MEDIA_CATEGORIES.CRITICAL_IMAGES) {
      try {
        const response = await fetch(imageUrl, { method: "HEAD" })
        if (response.ok) {
          await criticalImageCache.add(imageUrl)
        }
      } catch (error) {
        console.warn(`Failed to warm cache for ${imageUrl}:`, error)
      }
    }
  } catch (error) {
    console.warn("Cache warming failed:", error)
  }
}

async function cleanupCachesBySize() {
  try {
    // Check each cache bucket and clean up if over limits
    for (const [cacheType, cacheName] of Object.entries(CACHE_BUCKETS)) {
      const cache = await caches.open(cacheName)
      const cacheSize = await getCacheSize(cacheName)
      const limit = STORAGE_LIMITS[cacheType]

      if (cacheSize > limit) {
        const keys = await cache.keys()
        const entriesToDelete = Math.ceil(keys.length * 0.3) // Remove 30% of entries

        // Delete oldest entries (assumes keys are in chronological order)
        for (let i = 0; i < entriesToDelete && i < keys.length; i++) {
          await cache.delete(keys[i])
        }
      }
    }
  } catch (error) {
    console.warn("Cache size cleanup failed:", error)
  }
}

// Clean up old caches and initialize on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      // Warm critical caches
      warmCriticalCaches(),
      // Initial cache size cleanup
      cleanupCachesBySize(),
      // Claim all clients
      self.clients.claim(),
    ])
  )
})

// Periodic cache maintenance
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_MAINTENANCE") {
    event.waitUntil(Promise.all([cleanupCachesBySize(), cleanupOldCaches()]))
  }
})

// Enhanced push notifications with project updates
self.addEventListener("push", (event) => {
  let notificationData = {
    title: "Narkin's Builders",
    body: "New update available!",
    icon: "/icons/icon-192x192.svg",
    badge: "/icons/icon-72x72.svg",
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.url ? { url: data.url } : {},
      }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: notificationData.data.url || "/",
    },
    actions: [
      {
        action: "explore",
        title: "View Projects",
        icon: "/icons/icon-192x192.svg",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-192x192.svg",
      },
    ],
    requireInteraction: false,
    silent: false,
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Handle notification clicks with smart routing
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || "/"

  if (event.action === "explore" || !event.action) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === targetUrl && "focus" in client) {
              return client.focus()
            }
          }
          // Open new window if no existing one found
          if (clients.openWindow) {
            return clients.openWindow(targetUrl)
          }
        })
    )
  }
})
