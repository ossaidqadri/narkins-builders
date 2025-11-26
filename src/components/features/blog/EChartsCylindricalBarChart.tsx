import React from "react"
import ChartContainer from "./chart-container"

interface EChartsCylindricalBarChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  title: string
  subtitle?: string
  color?: string | string[]
  height?: number
  cylinderWidth?: number
  animationDuration?: number
  showLabels?: boolean
  metallic?: boolean
  glowEffect?: boolean
}

export default function EChartsCylindricalBarChart({
  data,
  title,
  subtitle,
  color = "#1890ff",
  height = 450,
  cylinderWidth = 30,
  animationDuration = 4000,
  showLabels = true,
  metallic = true,
  glowEffect = true,
}: EChartsCylindricalBarChartProps) {
  // Create metallic gradient effect
  const createMetallicGradient = (baseColor: string) => {
    const colorStops = metallic
      ? [
          { offset: 0, color: adjustBrightness(baseColor, 40) },
          { offset: 0.2, color: adjustBrightness(baseColor, 60) },
          { offset: 0.4, color: baseColor },
          { offset: 0.6, color: adjustBrightness(baseColor, -10) },
          { offset: 0.8, color: adjustBrightness(baseColor, -30) },
          { offset: 1, color: adjustBrightness(baseColor, -20) },
        ]
      : [
          { offset: 0, color: adjustBrightness(baseColor, 20) },
          { offset: 1, color: adjustBrightness(baseColor, -20) },
        ]

    return {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops,
    }
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
    animationEasing: "cubicOut",
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
      bottom: data.length > 4 ? "30%" : "25%",
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
        lineHeight: 14,
        rich: {
          a: {
            fontSize: 10,
            lineHeight: 14,
          },
        },
      },
      axisLine: {
        show: true,
        lineStyle: { color: "#e5e7eb" },
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
      min: 0,
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
      // Main cylindrical bars
      {
        type: "bar",
        data: data.map((item, index) => {
          const baseColor =
            item.color ||
            (Array.isArray(color) ? color[index % color.length] : color)

          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              color: createMetallicGradient(baseColor),
              borderRadius: [cylinderWidth / 2, cylinderWidth / 2, 0, 0],
              borderWidth: 1,
              borderColor: adjustBrightness(baseColor, 20),
              shadowBlur: glowEffect ? 15 : 8,
              shadowColor: glowEffect
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: glowEffect ? 20 : 12,
                borderWidth: 2,
                opacity: 1,
              },
            },
          }
        }),
        barWidth: cylinderWidth,
        z: 2,
        label: showLabels
          ? {
              show: true,
              position: "top",
              color: "#374151",
              fontSize: 12,
              fontWeight: "bold",
              formatter: "{c}",
              distance: 8,
            }
          : { show: false },
      },
      // Highlight reflection strip
      {
        type: "bar",
        data: data.map((item, index) => {
          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: "transparent" },
                  { offset: 0.25, color: "rgba(255, 255, 255, 0.4)" },
                  { offset: 0.35, color: "rgba(255, 255, 255, 0.6)" },
                  { offset: 0.45, color: "rgba(255, 255, 255, 0.4)" },
                  { offset: 1, color: "transparent" },
                ],
              },
              borderRadius: [cylinderWidth / 2, cylinderWidth / 2, 0, 0],
            },
          }
        }),
        barWidth: cylinderWidth * 0.15,
        barGap: "-100%",
        z: 3,
        silent: true,
      },
    ],
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
