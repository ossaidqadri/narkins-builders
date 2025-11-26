import React from "react"
import ChartContainer from "./chart-container"

interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
  itemStyle?: {
    color?: string
    [key: string]: any
  }
}

interface EChartsSunburstProps {
  data: SunburstNode[]
  title: string
  height?: number
  colors?: string[]
  minValue?: number
  maxValue?: number
  radius?: [string | number, string | number]
  labelRotate?: "radial" | "tangential" | number
  showVisualMap?: boolean
  sort?: "desc" | "asc" | null
}

export default function EChartsSunburst({
  data,
  title,
  height = 400,
  colors = ["#2F93C8", "#AEC48F", "#FFDB5C", "#F98862"],
  minValue = 0,
  maxValue = 10,
  radius = [0, "90%"],
  labelRotate = 0,
  showVisualMap = true,
  sort = "desc",
}: EChartsSunburstProps) {
  const option = {
    visualMap: showVisualMap
      ? {
          type: "continuous",
          min: minValue,
          max: maxValue,
          inRange: {
            color: colors,
          },
          show: false,
          textStyle: {
            color: "#6b7280",
            fontSize: 12,
          },
        }
      : undefined,
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const value = params.value || 0
        const percent = params.percent || 0
        return `${params.name}<br/>Value: ${value}<br/>Percent: ${percent.toFixed(2)}%`
      },
    },
    series: {
      type: "sunburst",
      data: data,
      radius: radius,
      sort: sort,
      label: {
        rotate: labelRotate,
        fontSize: 14,
        color: "#1f2937",
        fontWeight: 500,
        padding: [6, 10],
        minAngle: 8,
        overflow: "truncate",
        formatter: function (params: any) {
          // Hide labels on very small segments
          if (params.percent < 5) return ""
          // Truncate long labels
          if (params.name.length > 20) {
            return params.name.substring(0, 20) + "..."
          }
          return params.name
        },
      },
      emphasis: {
        focus: "ancestor",
      },
      levels: [
        {},
        {
          r0: "15%",
          r: "35%",
          itemStyle: {
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: {
            rotate: labelRotate,
            fontSize: 16,
            fontWeight: "bold",
            position: "inside",
          },
        },
        {
          r0: "35%",
          r: "65%",
          itemStyle: {
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: {
            rotate: labelRotate,
            fontSize: 14,
            fontWeight: 500,
            position: "inside",
          },
        },
        {
          r0: "65%",
          r: "90%",
          itemStyle: {
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: {
            rotate: labelRotate,
            fontSize: 13,
            padding: [6, 10],
            position: "outside",
            distanceToLabelLine: 5,
          },
        },
      ],
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 2,
      },
    },
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
