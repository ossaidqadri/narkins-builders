#!/usr/bin/env node
import { isMainThread, parentPort, Worker, workerData } from "worker_threads"
import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import remarkGfm from "remark-gfm"

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// FAQ data - using empty arrays to ensure serialization works without external dependencies
const faqData = {
  firstTimeBuyerFAQs: [],
  investmentGuideFAQs: [],
  twoBedroomFAQs: [],
  luxuryApartmentsFAQs: [],
  generalRealEstateFAQs: [],
  hillCrestFAQs: [],
  boutiqueResidencyFAQs: [],
  apartmentSaleFAQs: [],
}

const blogsDir = path.join(process.cwd(), "content/blogs")
const cacheDir = path.join(process.cwd(), ".mdx-cache")
const cpuCount = os.cpus().length
const maxWorkers = Math.min(6, Math.max(2, cpuCount)) // Adaptive scaling
const memoryThresholdMB = 500 // Memory threshold per worker

interface MDXCache {
  slug: string
  title: string
  excerpt: string
  date: string
  image: string
  readTime: string
  keywords: string
  serializedMDX: any // Full serialized MDX output
  lastModified: number
  processingTime?: number
  retryCount?: number
  cacheVersion: string
}

interface WorkerResult {
  success: boolean
  result?: MDXCache
  error?: string
  slug?: string
  processingTime?: number
  memoryUsed?: number
}

const CACHE_VERSION = "1.3.0"

// Worker code - pre-compiles individual blog posts with enhanced error handling
if (!isMainThread) {
  const { filePath, slug, retryCount = 0 } = workerData
  const startTime = Date.now()
  const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024 // MB

  const cleanup = () => {
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
  }

  const sendResult = (result: WorkerResult) => {
    const processingTime = Date.now() - startTime
    const memoryUsed =
      process.memoryUsage().heapUsed / 1024 / 1024 - initialMemory

    parentPort?.postMessage({
      ...result,
      processingTime,
      memoryUsed,
    })

    cleanup()
  }

  try {
    const fileContents = fs.readFileSync(filePath, "utf8")
    const matterResult = matter(fileContents)
    const stat = fs.statSync(filePath)

    console.log(`[MDX Worker] Processing: ${slug} (attempt ${retryCount + 1})`)

    // Validate content before processing
    if (!matterResult.content || matterResult.content.trim().length === 0) {
      throw new Error("Empty content")
    }

    // Full MDX serialization with production settings
    const serializePromise = serialize(matterResult.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
        development: false, // Force production mode
      },
      parseFrontmatter: false, // We already parsed frontmatter
      scope: faqData,
    })

    // Add timeout for serialization
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Serialization timeout")), 30000) // 30s timeout
    })

    Promise.race([serializePromise, timeoutPromise])
      .then((serializedMDX: any) => {
        const result: MDXCache = {
          slug,
          title: matterResult.data.title || "Untitled",
          excerpt: matterResult.data.excerpt || "",
          date: matterResult.data.date
            ? new Date(matterResult.data.date).toISOString()
            : new Date().toISOString(),
          image:
            matterResult.data.image || "/images/narkins-builders-logo.webp",
          readTime: matterResult.data.readTime || "5 min read",
          keywords: matterResult.data.keywords || "",
          serializedMDX, // Store full serialized output
          lastModified: stat.mtimeMs,
          processingTime: Date.now() - startTime,
          retryCount,
          cacheVersion: CACHE_VERSION,
        }

        sendResult({ success: true, result })
      })
      .catch((error) => {
        console.error(`[MDX Worker] Error processing ${slug}:`, error.message)
        sendResult({
          success: false,
          error: `${error.message} (attempt ${retryCount + 1})`,
          slug,
        })
      })
  } catch (error: any) {
    console.error(`[MDX Worker] Fatal error for ${slug}:`, error.message)
    sendResult({
      success: false,
      error: `Fatal: ${error.message} (attempt ${retryCount + 1})`,
      slug,
    })
  }
}

// Main thread - orchestrates parallel MDX pre-compilation with enhanced management
async function precompileMDX() {
  if (!isMainThread) return

  console.log("[MDX] Starting enhanced parallel MDX pre-compilation...")
  console.log(
    `[MDX] System info: ${cpuCount} CPUs, using ${maxWorkers} workers`
  )

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }

  // Recursive function to find all .mdx files
  function findAllMdxFiles(
    dir: string
  ): Array<{ fileName: string; fullPath: string }> {
    const results: Array<{ fileName: string; fullPath: string }> = []

    function scanDirectory(currentDir: string) {
      const items = fs.readdirSync(currentDir, { withFileTypes: true })

      for (const item of items) {
        const itemPath = path.join(currentDir, item.name)

        if (item.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(itemPath)
        } else if (item.isFile() && item.name.endsWith(".mdx")) {
          results.push({
            fileName: item.name,
            fullPath: itemPath,
          })
        }
      }
    }

    scanDirectory(dir)
    return results
  }

  const fileInfos = findAllMdxFiles(blogsDir)
  const files = fileInfos.map((info) => info.fileName)
  console.log(`[MDX] Found ${files.length} blog posts to precompile`)

  const workers: Worker[] = []
  const results: MDXCache[] = []
  const errors: string[] = []
  const retryQueue: Array<{ fileName: string; retryCount: number }> = []
  const processingStats = {
    totalTime: Date.now(),
    avgProcessingTime: 0,
    peakMemoryUsage: 0,
    successfulCompilations: 0,
    failedCompilations: 0,
  }

  return new Promise<void>((resolve, reject) => {
    let completed = 0
    let started = 0
    let activeWorkers = 0

    function processNext() {
      // Process retries first
      if (retryQueue.length > 0 && activeWorkers < maxWorkers) {
        const { fileName, retryCount } = retryQueue.shift()!
        processFile(fileName, retryCount)
        return
      }

      if (started >= files.length) return

      const fileName = files[started++]
      processFile(fileName, 0)
    }

    function processFile(fileName: string, retryCount: number) {
      if (activeWorkers >= maxWorkers) {
        // Queue for later
        if (retryCount === 0) {
          retryQueue.push({ fileName, retryCount })
        }
        return
      }

      const slug = fileName.replace(/\.mdx$/, "")
      const fileInfo = fileInfos.find((f) => f.fileName === fileName)
      const filePath = fileInfo
        ? fileInfo.fullPath
        : path.join(blogsDir, fileName)
      const cacheFilePath = path.join(cacheDir, `${slug}.json`)

      // Check if cache is valid
      const stat = fs.statSync(filePath)
      if (fs.existsSync(cacheFilePath) && retryCount === 0) {
        try {
          const cached = JSON.parse(fs.readFileSync(cacheFilePath, "utf8"))
          // Check both modification time and cache version
          if (
            cached.lastModified >= stat.mtimeMs &&
            cached.cacheVersion === CACHE_VERSION
          ) {
            console.log(`[MDX] Using cached: ${slug}`)
            results.push(cached)
            completed++
            processingStats.successfulCompilations++

            checkCompletion()
            processNext()
            return
          }
        } catch (e) {
          console.warn(`[MDX] Invalid cache for ${slug}, reprocessing`)
        }
      }

      console.log(`[MDX] Starting worker for: ${slug} (retry: ${retryCount})`)

      const worker = new Worker(__filename, {
        workerData: { filePath, slug, retryCount },
        // Note: resourceLimits not supported in Bun yet
      })

      workers.push(worker)
      activeWorkers++

      const workerTimeout = setTimeout(() => {
        console.error(`[MDX] Worker timeout for ${slug}, terminating`)
        worker.terminate()
        handleWorkerCompletion(
          slug,
          {
            success: false,
            error: `Worker timeout after 60s (retry ${retryCount})`,
            slug,
          },
          retryCount
        )
      }, 60000) // 60s worker timeout

      worker.on("message", (message: WorkerResult) => {
        clearTimeout(workerTimeout)
        handleWorkerCompletion(slug, message, retryCount)
      })

      worker.on("error", (error) => {
        clearTimeout(workerTimeout)
        console.error(`[MDX] Worker error for ${slug}:`, error.message)
        handleWorkerCompletion(
          slug,
          {
            success: false,
            error: `Worker error: ${error.message}`,
            slug,
          },
          retryCount
        )
      })
    }

    function handleWorkerCompletion(
      slug: string,
      message: WorkerResult,
      retryCount: number
    ) {
      activeWorkers--

      // Update stats
      if (message.processingTime) {
        processingStats.avgProcessingTime =
          (processingStats.avgProcessingTime *
            processingStats.successfulCompilations +
            message.processingTime) /
          (processingStats.successfulCompilations + 1)
      }
      if (
        message.memoryUsed &&
        message.memoryUsed > processingStats.peakMemoryUsage
      ) {
        processingStats.peakMemoryUsage = message.memoryUsed
      }

      if (message.success && message.result) {
        results.push(message.result)
        processingStats.successfulCompilations++

        // Cache the full result
        const cacheFilePath = path.join(cacheDir, `${slug}.json`)
        try {
          fs.writeFileSync(
            cacheFilePath,
            JSON.stringify(message.result, null, 2)
          )
          console.log(
            `[MDX] SUCCESS: Completed: ${slug} (${message.processingTime}ms, ${message.memoryUsed?.toFixed(1)}MB)`
          )
        } catch (cacheError) {
          console.error(`[MDX] Failed to cache ${slug}:`, cacheError)
        }
      } else {
        processingStats.failedCompilations++

        // Retry logic
        if (retryCount < 2) {
          console.warn(
            `[MDX] WARNING: Retrying ${slug} (attempt ${retryCount + 2}/3)`
          )
          retryQueue.push({
            fileName: `${slug}.mdx`,
            retryCount: retryCount + 1,
          })
          processNext()
          return
        } else {
          errors.push(
            `[ERROR] Failed to precompile ${slug} after 3 attempts: ${message.error}`
          )
          console.error(`[MDX] ERROR: Failed: ${slug} - ${message.error}`)
        }
      }

      completed++
      checkCompletion()
      processNext()
    }

    function checkCompletion() {
      if (completed === files.length && retryQueue.length === 0) {
        processingStats.totalTime = Date.now() - processingStats.totalTime
        cleanup()

        if (errors.length > 0) {
          console.error(
            `\n[MDX] ERROR: Completed with ${errors.length} errors:\n${errors.join("\n")}`
          )
          reject(new Error(`Failed to precompile ${errors.length} blog posts`))
        } else {
          resolve()
        }
      }
    }

    function cleanup() {
      workers.forEach((worker) => {
        try {
          worker.terminate()
        } catch (e) {
          // Worker already terminated
        }
      })

      // Write master index with metadata and stats
      const sortedResults = results.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      const indexData = {
        posts: sortedResults.map(({ serializedMDX, ...post }) => post),
        lastUpdated: new Date().toISOString(),
        totalPosts: results.length,
        cacheVersion: CACHE_VERSION,
        buildStats: {
          totalTime: `${(processingStats.totalTime / 1000).toFixed(2)}s`,
          avgProcessingTime: `${Math.round(processingStats.avgProcessingTime)}ms`,
          peakMemoryUsage: `${processingStats.peakMemoryUsage.toFixed(1)}MB`,
          successfulCompilations: processingStats.successfulCompilations,
          failedCompilations: processingStats.failedCompilations,
          workersUsed: maxWorkers,
          cpuCount,
        },
      }

      try {
        fs.writeFileSync(
          path.join(cacheDir, "index.json"),
          JSON.stringify(indexData, null, 2)
        )
      } catch (indexError) {
        console.error("[MDX] Failed to write index file:", indexError)
      }

      console.log(`\n[MDX] SUCCESS: Pre-compilation complete!`)
      console.log(`[MDX] PROCESSED: ${results.length} posts`)
      console.log(
        `[MDX] TIMING: Total time: ${(processingStats.totalTime / 1000).toFixed(2)}s`
      )
      console.log(
        `[MDX] STATS: Avg time per post: ${Math.round(processingStats.avgProcessingTime)}ms`
      )
      console.log(
        `[MDX] MEMORY: Peak usage: ${processingStats.peakMemoryUsage.toFixed(1)}MB`
      )
      console.log(`[MDX] WORKERS: Used ${maxWorkers}/${cpuCount}`)

      if (errors.length > 0) {
        console.log(
          `[MDX] ERROR: ${errors.length}/${files.length} posts failed`
        )
      }
    }

    // Start initial workers
    const initialWorkers = Math.min(maxWorkers, files.length)
    for (let i = 0; i < initialWorkers; i++) {
      processNext()
    }
  })
}

if (isMainThread) {
  precompileMDX().catch((error) => {
    console.error("[MDX] ERROR: Precompilation failed:", error)
    process.exit(1)
  })
}
