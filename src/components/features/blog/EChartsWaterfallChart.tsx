import React from "react"
import ChartContainer from "./chart-container"

interface EChartsWaterfallChartProps {
  data: Array<{
    name: string
    value: number
    isTotal?: boolean
    color?: string
  }>
  title: string
  subtitle?: string
  height?: number
  showLabels?: boolean
  positiveColor?: string
  negativeColor?: string
  totalColor?: string
  transparentColor?: string
  animationDuration?: number
  formatter?: (params: any) => string
}

export default function EChartsWaterfallChart({
  data,
  title,
  subtitle,
  height = 400,
  showLabels = true,
  positiveColor = "#52c41a",
  negativeColor = "#ff4d4f",
  totalColor = "#1890ff",
  transparentColor = "transparent",
  animationDuration = 3000,
  formatter,
}: EChartsWaterfallChartProps) {
  // Calculate cumulative values for waterfall effect
  const categories = data.map((item) => item.name)
  let cumulative = 0
  const placeholderData = []
  const actualData = []

  data.forEach((item, index) => {
    if (item.isTotal) {
      // For total bars, start from 0
      placeholderData.push(0)
      actualData.push({
        value: item.value,
        itemStyle: {
          color: item.color || totalColor,
          borderRadius: [4, 4, 0, 0],
        },
      })
      cumulative = item.value
    } else {
      // For increment/decrement bars
      placeholderData.push(cumulative)
      actualData.push({
        value: item.value,
        itemStyle: {
          color:
            item.color || (item.value >= 0 ? positiveColor : negativeColor),
          borderRadius: [4, 4, 0, 0],
        },
      })
      cumulative += item.value
    }
  })

  const option = {
    animationDuration: animationDuration,
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
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter:
        formatter ||
        function (params: any) {
          const actualBar = params.find(
            (p: any) => p.seriesName !== "Placeholder"
          )
          if (actualBar) {
            const value = actualBar.value
            const sign = value >= 0 ? "+" : ""
            return `${actualBar.name}<br/>${actualBar.seriesName}: ${sign}${value}`
          }
          return ""
        },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: subtitle ? "15%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: categories,
      axisLabel: {
        color: "#6b7280",
        rotate: categories.length > 6 ? 45 : 0,
      },
      axisLine: {
        lineStyle: { color: "#e5e7eb" },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#6b7280",
        formatter: function (value: number) {
          return value >= 1000
            ? (value / 1000).toFixed(1) + "K"
            : value.toString()
        },
      },
      axisLine: {
        lineStyle: { color: "#e5e7eb" },
      },
      splitLine: {
        lineStyle: { color: "#f3f4f6" },
      },
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: transparentColor,
          color: transparentColor,
        },
        emphasis: {
          itemStyle: {
            borderColor: transparentColor,
            color: transparentColor,
          },
        },
        data: placeholderData,
        silent: true,
      },
      {
        name: "Amount",
        type: "bar",
        stack: "Total",
        label: showLabels
          ? {
              show: true,
              position: "inside",
              formatter: function (params: any) {
                const value = params.value
                if (value === 0) return ""
                const sign = value >= 0 ? "+" : ""
                return `${sign}${value}`
              },
              color: "#fff",
              fontSize: 11,
              fontWeight: "bold",
            }
          : { show: false },
        data: actualData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
