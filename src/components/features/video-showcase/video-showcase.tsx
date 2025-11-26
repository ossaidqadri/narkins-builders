import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { PlayIcon } from "@heroicons/react/24/solid"
import { featuredVideos } from "@/data/about-data"

interface VideoEmbedProps {
  video: {
    id: string
    title: string
    description: string
    category: string
  }
  index: number
}

const LazyVideoEmbed: React.FC<VideoEmbedProps> = ({ video, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // Load videos immediately when component mounts (page load)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100) // Small delay to prevent blocking initial render

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
        <div className="relative w-full h-[180px] lg:h-[320px]">
          {!isVisible ? (
            // Placeholder with thumbnail before intersection
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-20 h-20 text-white/60 mx-auto mb-6" />
                <p className="text-white/80 text-lg ">{video.title}</p>
                <p className="text-white/60 text-sm mt-2">
                  Scroll to load video
                </p>
              </div>
            </div>
          ) : (
            <>
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&showinfo=0&color=white&theme=dark&autoplay=0`}
                title={video.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl"
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
              />
            </>
          )}
        </div>

        {/* Hover overlay for non-loaded videos */}
        {!isVisible && (
          <div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={() => setIsVisible(true)}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
              <PlayIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Video details */}
      <div className="p-6 lg:p-8">
        <h3 className="text-lg lg:text-xl text-gray-900 group-hover:text-primary transition-colors duration-200">
          {video.title}
        </h3>
        <p className="text-gray-600 mt-4 text-sm lg:text-base leading-relaxed">
          {video.description}
        </p>
      </div>
    </motion.div>
  )
}

interface VideoShowcaseProps {}

const VideoShowcase: React.FC<VideoShowcaseProps> = () => {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-primary text-sm uppercase tracking-wider">
              Video Showcase
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-3xl text-gray-900 sm:text-4xl mb-4">
            Stories Behind Our Success
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our team, hear from satisfied clients, and discover what makes
            Narkin's Builders the trusted choice for premium real estate in
            Bahria Town Karachi.
          </p>
        </motion.div>

        {/* Video grid - 2x2 layout */}
        <div className="space-y-20">
          {/* First row - 2 videos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {featuredVideos.slice(0, 2).map((video, index) => (
              <LazyVideoEmbed key={video.id} video={video} index={index} />
            ))}
          </div>

          {/* Second row - 2 videos */}
          {featuredVideos.length > 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {featuredVideos.slice(2, 4).map((video, index) => (
                <LazyVideoEmbed
                  key={video.id}
                  video={video}
                  index={index + 2}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div
            className="rounded-2xl p-8 lg:p-12"
            style={{ backgroundColor: "#FAFAFA" }}
          >
            <h3 className="text-2xl text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Join hundreds of satisfied families who have made Narkin's
              Builders their trusted partner for premium living spaces in Bahria
              Town Karachi.
            </p>
            <button
              onClick={() =>
                window.open("https://wa.me/923203243970", "_blank")
              }
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us on WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default VideoShowcase
