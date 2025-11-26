import React from "react"
import ChartContainer from "./chart-container"

interface ECharts3DBarChartProps {
  data: Array<{ name: string; value: number; category?: string }>
  title: string
  subtitle?: string
  color?: string | string[]
  height?: number
  viewAngle?: [number, number] // [alpha, beta] rotation angles
  animationDuration?: number
  showLabels?: boolean
  barDepth?: number
  barWidth?: number
  lighting?: boolean
}

export default function ECharts3DBarChart({
  data,
  title,
  subtitle,
  color = "#1890ff",
  height = 500,
  viewAngle = [30, 30],
  animationDuration = 4000,
  showLabels = true,
  barDepth = 20,
  barWidth = 20,
  lighting = true,
}: ECharts3DBarChartProps) {
  // Simulate 3D effect using custom series with perspective transforms
  const create3DEffect = (baseData: any[], depth: number) => {
    return baseData
      .map((item, index) => {
        const baseColor = Array.isArray(color)
          ? color[index % color.length]
          : color

        // Create multiple layers for 3D effect
        return [
          // Back face (darker)
          {
            ...item,
            itemStyle: {
              color: baseColor,
              opacity: 0.6,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          // Front face (brighter)
          {
            ...item,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: baseColor },
                  { offset: 1, color: adjustBrightness(baseColor, 20) },
                ],
              },
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.3)",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowOffsetX: 3,
              shadowOffsetY: 3,
            },
          },
        ]
      })
      .flat()
  }

  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, percent: number) => {
    const hex = color.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    const adjustedR = Math.min(255, Math.max(0, r + (r * percent) / 100))
    const adjustedG = Math.min(255, Math.max(0, g + (g * percent) / 100))
    const adjustedB = Math.min(255, Math.max(0, b + (b * percent) / 100))

    return `rgb(${Math.round(adjustedR)}, ${Math.round(adjustedG)}, ${Math.round(adjustedB)})`
  }

  const option = {
    animationDuration: animationDuration,
    animationEasing: "elasticOut",
    title: {
      text: title,
      subtext: subtitle,
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
      },
      subtextStyle: {
        fontSize: 12,
        color: "#6b7280",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `${params.name}<br/>Value: ${params.value}`
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "transparent",
      textStyle: {
        color: "#ffffff",
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: data.length > 4 ? "25%" : "20%",
      top: subtitle ? "20%" : "15%",
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel: {
        color: "#6b7280",
        rotate: data.length > 4 ? 45 : 0,
        fontSize: 10,
        margin: 20,
        overflow: "break",
        width: data.length > 6 ? 80 : 100,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#6b7280",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    series: [
      // Shadow/depth layer
      {
        type: "bar",
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: "rgba(0, 0, 0, 0.1)",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: barWidth + 4,
        barGap: "-100%",
        z: 1,
        silent: true,
        animation: false,
      },
      // Main 3D bars
      {
        type: "bar",
        data: data.map((item, index) => {
          const baseColor = Array.isArray(color)
            ? color[index % color.length]
            : color

          return {
            ...item,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: adjustBrightness(baseColor, 30) },
                  { offset: 0.3, color: baseColor },
                  { offset: 0.7, color: baseColor },
                  { offset: 1, color: adjustBrightness(baseColor, -20) },
                ],
              },
              borderRadius: [6, 6, 0, 0],
              borderWidth: 2,
              borderColor: adjustBrightness(baseColor, 40),
              shadowBlur: 15,
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowOffsetX: 5,
              shadowOffsetY: 5,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 25,
                shadowOffsetX: 8,
                shadowOffsetY: 8,
                borderWidth: 3,
              },
            },
          }
        }),
        barWidth: barWidth,
        z: 2,
        label: showLabels
          ? {
              show: true,
              position: "top",
              color: "#374151",
              fontSize: 12,
              fontWeight: "bold",
              formatter: "{c}",
              distance: 10,
            }
          : { show: false },
      },
      // Highlight layer (top edge)
      {
        type: "bar",
        data: data.map((item, index) => {
          const baseColor = Array.isArray(color)
            ? color[index % color.length]
            : color

          return {
            name: item.name,
            value: item.value * 0.05, // Small highlight on top
            itemStyle: {
              color: adjustBrightness(baseColor, 60),
              borderRadius: [8, 8, 4, 4],
            },
          }
        }),
        barWidth: barWidth - 4,
        barGap: "-100%",
        z: 3,
        silent: true,
        stack: "highlight",
      },
    ],
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
