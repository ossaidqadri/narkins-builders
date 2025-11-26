import VideoPlayerControls from "@/components/features/video-player/video-player-controls"
import { Fragment, useEffect, useRef, useState } from "react"

export default function VideoPlayer({
  src,
  poster,
}: {
  src: string
  poster?: string
}) {
  const [videoProgress, setVideoProgress] = useState<number>(0)
  const [videoDuration, setVideoDuration] = useState<number>()
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Start loading video immediately when visible
          if (entry.intersectionRatio > 0.1) {
            setIsLoading(true)
            // Add small delay to prevent flash, then load
            setTimeout(() => {
              setShouldLoad(true)
            }, 300)
          }
        }
      },
      {
        threshold: [0.1, 0.5],
        rootMargin: "50px 0px", // Start loading 50px before element comes into view
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      setVideoDuration(video.duration)
      // Enforce iPhone-compatible settings
      video.muted = true
      video.playsInline = true
      if (isVisible) {
        video
          .play()
          .catch((error) => console.error("Video autoplay failed:", error))
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (isPaused) return
    const currentTime = videoRef.current?.currentTime
    if (videoDuration != null && currentTime != null) {
      let loadingTimeout = setTimeout(() => {
        if (videoProgress == currentTime / videoDuration) {
          setVideoProgress((prev) => prev + 0.000001)
        } else {
          setVideoProgress(currentTime / videoDuration)
        }
      }, 10)

      return () => {
        clearTimeout(loadingTimeout)
      }
    }
  }, [videoProgress, videoDuration, isPaused])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (video) {
      setIsPaused(!video.paused)
      video.paused ? video.play() : video.pause()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden my-8"
      style={{ aspectRatio: "16/9" }} // 1920x1080 aspect ratio
    >
      {!shouldLoad ? (
        // Lazy loading placeholder with poster image
        <div
          className="w-full h-full relative flex items-center justify-center"
          style={{
            aspectRatio: "16/9",
            backgroundImage: poster
              ? `url(${poster})`
              : "linear-gradient(to bottom right, #e5e7eb, #d1d5db)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Play button and loading text */}
          <div className="relative text-center z-10">
            {isLoading ? (
              // Loading spinner
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              // Play button
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => setShouldLoad(true), 300)
                }}
              >
                <svg
                  className="w-10 h-10 text-gray-800 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            {!isLoading && (
              <p className="text-white text-sm font-medium drop-shadow-lg">
                Click to load video
              </p>
            )}
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="absolute top-4 right-4 z-10">
            <VideoPlayerControls
              progress={videoProgress}
              isPaused={isPaused}
              onPlayPause={togglePlayPause}
            />
          </div>
          <video
            className="w-full h-full object-cover bg-neutral-300"
            poster={poster}
            ref={videoRef}
            preload="metadata"
            loop
            autoPlay={isVisible}
            playsInline
            muted
            controls={false}
            disablePictureInPicture
            {...({ "webkit-playsinline": "true" } as any)}
            {...({ "x5-playsinline": "true" } as any)}
            {...({ "x5-video-player-type": "h5" } as any)}
            style={{ aspectRatio: "16/9" }}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Fragment>
      )}

      {/* Responsive overlay for mobile */}
      {!shouldLoad && !isLoading && (
        <div className="absolute inset-0 lg:hidden">
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setShouldLoad(true), 300)
              }}
              className="bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg font-medium"
            >
              Load Video
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
