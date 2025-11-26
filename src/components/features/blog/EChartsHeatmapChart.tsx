import React from "react"
import ChartContainer from "./chart-container"

interface EChartsHeatmapChartProps {
  data:
    | Array<[number, number, number]>
    | Array<{ x: string | number; y: string | number; value: number }>
  title: string
  xAxisData?: string[]
  yAxisData?: string[]
  colorRange?: [string, string]
  height?: number
  showLabels?: boolean
  animationDuration?: number
  visualMapPosition?: "left" | "right" | "top" | "bottom"
  gridSize?: number
}

export default function EChartsHeatmapChart({
  data,
  title,
  xAxisData = [],
  yAxisData = [],
  colorRange = ["#ffffff", "#1890ff"],
  height = 400,
  showLabels = false,
  animationDuration = 3000,
  visualMapPosition = "right",
  gridSize = 20,
}: EChartsHeatmapChartProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Transform data if needed
  let processedData
  let xAxis, yAxis

  if (Array.isArray(data[0])) {
    // Data is in [x, y, value] format
    processedData = data as Array<[number, number, number]>

    // Extract unique x and y values if not provided
    if (xAxisData.length === 0) {
      const xValues = [...new Set(processedData.map((item) => item[0]))].sort(
        (a, b) => a - b
      )
      xAxis = { type: "category", data: xValues.map(String) }
    } else {
      xAxis = { type: "category", data: xAxisData }
    }

    if (yAxisData.length === 0) {
      const yValues = [...new Set(processedData.map((item) => item[1]))].sort(
        (a, b) => a - b
      )
      yAxis = { type: "category", data: yValues.map(String) }
    } else {
      yAxis = { type: "category", data: yAxisData }
    }
  } else {
    // Data is in {x, y, value} format
    const objData = data as Array<{
      x: string | number
      y: string | number
      value: number
    }>

    // Extract axis data
    const xValues =
      xAxisData.length > 0
        ? xAxisData
        : [...new Set(objData.map((item) => String(item.x)))]
    const yValues =
      yAxisData.length > 0
        ? yAxisData
        : [...new Set(objData.map((item) => String(item.y)))]

    xAxis = { type: "category", data: xValues }
    yAxis = { type: "category", data: yValues }

    // Transform to [x, y, value] format
    processedData = objData.map((item) => [
      xValues.indexOf(String(item.x)),
      yValues.indexOf(String(item.y)),
      item.value,
    ])
  }

  // Calculate min and max values for visual map
  const values = processedData.map((item) => item[2])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  const option = {
    animationDuration: animationDuration,
    title: {
      text: isMobile
        ? title.substring(0, 40) + (title.length > 40 ? "..." : "")
        : title,
      left: "center",
      top: isMobile ? "2%" : "5%",
      textStyle: {
        fontSize: isMobile ? 12 : 16,
        fontWeight: "bold",
        color: "#374151",
      },
    },
    tooltip: {
      position: "top",
      formatter: function (params: any) {
        const xLabel = xAxis.data[params.data[0]]
        const yLabel = yAxis.data[params.data[1]]
        return `${yLabel} - ${xLabel}<br/>Value: ${params.data[2]}`
      },
    },
    grid: {
      height: isMobile ? "55%" : "60%",
      top: isMobile ? "15%" : "20%",
      left: isMobile ? "25%" : "20%",
      right: visualMapPosition === "right" ? (isMobile ? "25%" : "20%") : "10%",
      bottom: isMobile ? "30%" : "20%",
      containLabel: true,
    },
    xAxis: {
      ...xAxis,
      position: "bottom",
      axisLabel: {
        color: "#6b7280",
        fontSize: isMobile ? 8 : 10,
        rotate: 45,
        interval: 0,
        formatter: function (value: string) {
          const maxLength = isMobile ? 8 : 15
          return value.length > maxLength
            ? value.substring(0, maxLength) + "..."
            : value
        },
      },
      axisLine: {
        lineStyle: { color: "#e5e7eb" },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["#f9fafb", "#ffffff"],
        },
      },
    },
    yAxis: {
      ...yAxis,
      axisLabel: {
        color: "#6b7280",
        fontSize: isMobile ? 8 : 10,
        interval: 0,
        formatter: function (value: string) {
          const maxLength = isMobile ? 12 : 20
          return value.length > maxLength
            ? value.substring(0, maxLength) + "..."
            : value
        },
      },
      axisLine: {
        lineStyle: { color: "#e5e7eb" },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["#f9fafb", "#ffffff"],
        },
      },
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: "vertical",
      [visualMapPosition]:
        visualMapPosition === "left" || visualMapPosition === "right"
          ? "2%"
          : undefined,
      [visualMapPosition === "top"
        ? "top"
        : visualMapPosition === "bottom"
          ? "bottom"
          : undefined]:
        visualMapPosition === "top" || visualMapPosition === "bottom"
          ? "5%"
          : undefined,
      inRange: {
        color: [colorRange[0], colorRange[1]],
      },
      textStyle: {
        color: "#374151",
      },
    },
    series: [
      {
        name: "Heatmap",
        type: "heatmap",
        data: processedData,
        label: showLabels
          ? {
              show: true,
              color: "#374151",
              fontSize: 9,
            }
          : { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#ffffff",
        },
      },
    ],
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
