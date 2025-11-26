import React from "react"

interface EChartsProgressBarProps {
  percent: number
  strokeColor?: string | string[]
  showInfo?: boolean
  strokeWidth?: number
  trailColor?: string
  status?: "success" | "exception" | "active" | "normal"
  size?: "small" | "default" | "large"
}

export default function EChartsProgressBar({
  percent,
  strokeColor = "#1890ff",
  showInfo = true,
  strokeWidth = 6,
  trailColor = "#f0f0f0",
  status = "normal",
  size = "default",
}: EChartsProgressBarProps) {
  const safePercent = Math.max(0, Math.min(100, percent))

  const getHeight = () => {
    switch (size) {
      case "small":
        return 4
      case "large":
        return 12
      default:
        return strokeWidth
    }
  }

  const getColor = () => {
    if (status === "success") return "#52c41a"
    if (status === "exception") return "#ff4d4f"
    if (Array.isArray(strokeColor)) return strokeColor[0]
    return strokeColor
  }

  const height = getHeight()
  const color = getColor()

  return (
    <div className="flex items-center space-x-3 w-full">
      <div
        className="flex-1 rounded-full overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: trailColor,
          height: `${height}px`,
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${safePercent}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showInfo && (
        <span className="text-sm font-medium text-gray-700 min-w-[40px]">
          {Math.round(safePercent)}%
        </span>
      )}
    </div>
  )
}
