import React from "react"
import ChartContainer from "./chart-container"

interface EChartsPolarBarChartProps {
  data: Array<{ category: string; value: number }>
  title: string
  color?: string | string[]
  height?: number
  innerRadius?: number | string
  outerRadius?: number | string
  startAngle?: number
  maxValue?: number
  showLabels?: boolean
  labelPosition?: "start" | "middle" | "end"
  animationDuration?: number
}

export default function EChartsPolarBarChart({
  data,
  title,
  color = "#1890ff",
  height = 400,
  innerRadius = 30,
  outerRadius = "80%",
  startAngle = 75,
  maxValue,
  showLabels = true,
  labelPosition = "middle",
  animationDuration = 3000,
}: EChartsPolarBarChartProps) {
  // Extract categories and values
  const categories = data.map((item) => item.category)
  const values = data.map((item) => item.value)
  const calculatedMaxValue = maxValue || Math.max(...values) * 1.1

  // Generate colors for each bar
  const getBarColors = () => {
    if (Array.isArray(color)) {
      return values.map((_, index) => color[index % color.length])
    }
    return color
  }

  const option = {
    animationDuration: animationDuration,
    title: {
      show: false,
    },
    polar: {
      radius: [innerRadius, outerRadius],
    },
    angleAxis: {
      max: calculatedMaxValue,
      startAngle: startAngle,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#f0f0f0",
          width: 1,
          type: "solid",
        },
      },
    },
    radiusAxis: {
      type: "category",
      data: categories,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: "#6b7280",
        fontSize: 12,
        margin: 8,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `${params.name}: ${params.value}`
      },
    },
    series: {
      type: "bar",
      data: values.map((value, index) => ({
        value: value,
        itemStyle: {
          color: Array.isArray(color) ? color[index % color.length] : color,
        },
      })),
      coordinateSystem: "polar",
      label: showLabels
        ? {
            show: true,
            position: labelPosition,
            formatter: "{c}",
            color: "#374151",
            fontSize: 11,
            fontWeight: "bold",
          }
        : {
            show: false,
          },
      barWidth: "60%",
      roundCap: true,
    },
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
