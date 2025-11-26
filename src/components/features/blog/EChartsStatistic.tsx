import React from "react"

interface EChartsStatisticProps {
  title: string
  value: number | string
  suffix?: string
  prefix?: React.ReactNode
  valueStyle?: React.CSSProperties
  precision?: number
  formatter?: (value: number | string) => React.ReactNode
}

export default function EChartsStatistic({
  title,
  value,
  suffix,
  prefix,
  valueStyle,
  precision,
  formatter,
}: EChartsStatisticProps) {
  const formatValue = () => {
    if (formatter) {
      return formatter(value)
    }

    if (typeof value === "number" && precision !== undefined) {
      return value.toFixed(precision)
    }

    if (typeof value === "number") {
      return value.toLocaleString()
    }

    return value
  }

  const defaultValueStyle: React.CSSProperties = {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#1f2937",
    ...valueStyle,
  }

  return (
    <div className="text-center space-y-2">
      <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {title}
      </div>
      <div className="flex items-center justify-center space-x-1">
        {prefix && <span className="text-gray-700">{prefix}</span>}
        <span style={defaultValueStyle}>{formatValue()}</span>
        {suffix && <span className="text-gray-600 text-lg">{suffix}</span>}
      </div>
    </div>
  )
}
