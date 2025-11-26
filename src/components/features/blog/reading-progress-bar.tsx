"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ReadingProgressBarProps {
  className?: string
}

export function ReadingProgressBar({
  className = "",
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    updateProgress() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] h-1 bg-gray-100 backdrop-blur-sm ${className}`}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      {/* Enhanced floating progress indicator */}
      {progress > 5 && (
        <motion.div
          className="absolute top-2 right-4 bg-white/90 backdrop-blur-md text-gray-700 px-3 py-1 rounded-full text-xs shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}% read
        </motion.div>
      )}
    </div>
  )
}

export default ReadingProgressBar
