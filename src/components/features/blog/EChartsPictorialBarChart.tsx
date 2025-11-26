import React from "react"
import ChartContainer from "./chart-container"

interface EChartsPictorialBarChartProps {
  data: Array<{ name: string; value: number; symbol?: string; color?: string }>
  title: string
  subtitle?: string
  symbolType?:
    | "rect"
    | "roundRect"
    | "triangle"
    | "diamond"
    | "pin"
    | "arrow"
    | "circle"
    | "building"
    | "house"
    | "custom"
  color?: string | string[]
  height?: number
  symbolSize?: [number, number] | number
  symbolRepeat?: boolean
  symbolClip?: boolean
  animationDuration?: number
  showLabels?: boolean
  orientation?: "vertical" | "horizontal"
}

export default function EChartsPictorialBarChart({
  data,
  title,
  subtitle,
  symbolType = "roundRect",
  color = "#1890ff",
  height = 400,
  symbolSize = [20, 4],
  symbolRepeat = true,
  symbolClip = true,
  animationDuration = 4000,
  showLabels = true,
  orientation = "vertical",
}: EChartsPictorialBarChartProps) {
  // Custom symbol paths for different types
  const customSymbols = {
    building:
      "path://M0,10 L0,0 L10,0 L10,10 Z M2,8 L3,8 L3,6 L2,6 Z M5,8 L6,8 L6,6 L5,6 Z M7,8 L8,8 L8,6 L7,6 Z M2,5 L3,5 L3,3 L2,3 Z M5,5 L6,5 L6,3 L5,3 Z M7,5 L8,5 L8,3 L7,3 Z",
    house:
      "path://M5,0 L0,5 L0,10 L2,10 L2,7 L8,7 L8,10 L10,10 L10,5 Z M3,8 L3,9 L7,9 L7,8 Z",
    custom:
      "path://M0,0 L5,0 Q10,0 10,5 L10,10 Q10,15 5,15 L0,15 Q-5,15 -5,10 L-5,5 Q-5,0 0,0 Z",
  }

  // Create gradient colors
  const createGradient = (baseColor: string, index: number) => {
    const colorMap: { [key: string]: string[] } = {
      "#1890ff": ["#1890ff", "#40a9ff", "#69c0ff"],
      "#52c41a": ["#52c41a", "#73d13d", "#95de64"],
      "#fa8c16": ["#fa8c16", "#ffa940", "#ffc069"],
      "#722ed1": ["#722ed1", "#9254de", "#b37feb"],
    }

    const gradientColorsMap = colorMap[baseColor] || colorMap["#1890ff"]

    return {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: gradientColorsMap[0] },
        { offset: 0.5, color: gradientColorsMap[1] },
        { offset: 1, color: gradientColorsMap[2] },
      ],
    }
  }

  // Prepare series data with enhanced styling
  const seriesData = data.map((item, index) => {
    const itemColor =
      item.color || (Array.isArray(color) ? color[index % color.length] : color)

    return {
      name: item.name,
      value: item.value,
      symbol:
        item.symbol ||
        customSymbols[symbolType as keyof typeof customSymbols] ||
        symbolType,
      symbolSize: Array.isArray(symbolSize)
        ? symbolSize
        : [symbolSize, symbolSize * 0.2],
      itemStyle: {
        color: createGradient(itemColor, index),
        shadowBlur: 8,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffsetY: 2,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: "rgba(0, 0, 0, 0.4)",
          opacity: 1,
        },
      },
    }
  })

  const option = {
    animationDuration: animationDuration,
    animationDelay: (idx: number) => idx * 200,
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
    xAxis:
      orientation === "vertical"
        ? {
            type: "category",
            data: data.map((item) => item.name),
            axisLabel: {
              color: "#6b7280",
              rotate: data.length > 4 ? 45 : 0,
              fontSize: 10,
              margin: 15,
              overflow: "break",
              width: data.length > 6 ? 80 : 100,
            },
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            axisTick: {
              show: false,
            },
          }
        : {
            type: "value",
            axisLabel: {
              color: "#6b7280",
            },
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            splitLine: {
              lineStyle: { color: "#f3f4f6" },
            },
          },
    yAxis:
      orientation === "vertical"
        ? {
            type: "value",
            axisLabel: {
              color: "#6b7280",
            },
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            splitLine: {
              lineStyle: { color: "#f3f4f6" },
            },
          }
        : {
            type: "category",
            data: data.map((item) => item.name),
            axisLabel: {
              color: "#6b7280",
            },
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            axisTick: {
              show: false,
            },
          },
    series: [
      {
        type: "pictorialBar",
        symbolRepeat: symbolRepeat,
        symbolClip: symbolClip,
        symbolMargin: 2,
        symbolBoundingData: Math.max(...data.map((item) => item.value)),
        data: seriesData,
        label: showLabels
          ? {
              show: true,
              position: orientation === "vertical" ? "top" : "right",
              color: "#374151",
              fontSize: 11,
              fontWeight: "bold",
              formatter: "{c}",
            }
          : { show: false },
        markLine: {
          symbol: "none",
          label: {
            show: false,
          },
          lineStyle: {
            color: "#fa8c16",
            type: "dashed",
            width: 2,
          },
          data: [],
        },
      },
    ],
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
