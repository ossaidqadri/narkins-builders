"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  size?: number
  className?: string
}

export function UserAvatar({ name, size, className }: UserAvatarProps) {
  // Generate initials
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Generate consistent color based on name
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-red-500",
    "bg-violet-500",
    "bg-orange-500",
    "bg-sky-500",
    "bg-pink-500",
    "bg-green-500",
  ]

  const colorIndex = name.length % colors.length
  const backgroundColor = colors[colorIndex]

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-semibold",
        backgroundColor,
        className
      )}
      style={size ? { width: size, height: size, fontSize: size * 0.4 } : {}}
    >
      {initials}
    </div>
  )
}

export default UserAvatar
