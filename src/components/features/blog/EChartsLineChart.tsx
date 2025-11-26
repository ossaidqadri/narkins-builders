import React from "react"
import ChartContainer from "./chart-container"

interface EChartsLineChartProps {
  data: Array<{
    year?: string
    month?: string
    price?: number
    demand?: number
    supply?: number
    value?: number
    type?: string
  }>
  title: string
  xField: string
  yField: string
  seriesField?: string
  color?: string | string[]
  smooth?: boolean
  height?: number
  showEndLabels?: boolean
  animationDuration?: number
  showSymbol?: boolean
  enableDataset?: boolean
  isArea?: boolean
  gradientColors?: string[]
  enableBrush?: boolean
  opacity?: number
}

export default function EChartsLineChart({
  data,
  title,
  xField,
  yField,
  seriesField,
  color = "#1890ff",
  smooth = true,
  height = 300,
  showEndLabels = false,
  animationDuration = 3000,
  showSymbol = false,
  enableDataset = false,
  isArea = false,
  gradientColors,
  enableBrush = false,
  opacity = 0.6,
}: EChartsLineChartProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Helper function to create gradient
  const createGradient = (colorArray: string[], seriesIndex = 0) => {
    const baseColor = Array.isArray(color)
      ? color[seriesIndex % color.length]
      : color
    const gradColors = gradientColors || [baseColor, baseColor]

    return {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: gradColors[0] || baseColor },
        { offset: 1, color: gradColors[1] || baseColor },
      ],
    }
  }

  let option

  if (enableDataset && seriesField) {
    // Advanced dataset-based approach (like your example)
    const seriesNames = Array.from(
      new Set(data.map((item) => item[seriesField as keyof typeof item]))
    )

    // Transform data to dataset format
    const datasetSource = data.map((item) => ({
      [xField]: item[xField as keyof typeof item],
      [yField]: item[yField as keyof typeof item],
      [seriesField]: item[seriesField as keyof typeof item],
    }))

    const datasetWithFilters = []
    const seriesList = []

    seriesNames.forEach((seriesName, index) => {
      const datasetId = `dataset_${seriesName}`

      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: "dataset_raw",
        transform: {
          type: "filter",
          config: {
            and: [{ dimension: seriesField, "=": seriesName }],
          },
        },
      })

      seriesList.push({
        type: "line",
        datasetId: datasetId,
        showSymbol: showSymbol,
        smooth: smooth,
        name: seriesName,
        endLabel: showEndLabels
          ? {
              show: true,
              formatter: function (params: any) {
                return `${params.seriesName}: ${params.value[yField]}`
              },
            }
          : undefined,
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: Array.isArray(color)
            ? color[index % color.length]
            : index === 0
              ? "#1890ff"
              : "#52c41a",
        },
        areaStyle: isArea
          ? {
              color: gradientColors
                ? createGradient(gradientColors, index)
                : Array.isArray(color)
                  ? color[index % color.length]
                  : index === 0
                    ? "#1890ff"
                    : "#52c41a",
              opacity: opacity,
            }
          : undefined,
        encode: {
          x: xField,
          y: yField,
          itemName: xField,
          tooltip: [yField],
        },
      })
    })

    option = {
      animationDuration: animationDuration,
      dataset: [
        {
          id: "dataset_raw",
          source: datasetSource,
        },
        ...datasetWithFilters,
      ],
      title: {
        show: false,
      },
      tooltip: {
        order: "valueDesc",
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      brush: enableBrush
        ? {
            toolbox: ["rect", "polygon", "keep", "clear"],
            xAxisIndex: 0,
            brushStyle: {
              borderWidth: 1,
              color: "rgba(120,140,180,0.15)",
              borderColor: "rgba(120,140,180,0.35)",
            },
          }
        : undefined,
      legend: {
        data: seriesNames,
        top: isMobile ? 30 : 10,
        orient: "horizontal",
        left: "center",
        textStyle: {
          fontSize: isMobile ? 10 : 12,
        },
        itemWidth: isMobile ? 10 : 18,
        itemHeight: isMobile ? 10 : 14,
        itemGap: isMobile ? 8 : 10,
      },
      xAxis: {
        type: "category",
        nameLocation: "middle",
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
          interval: isMobile ? "auto" : 0,
          rotate: isMobile ? 45 : 0,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
        },
        splitLine: {
          lineStyle: { color: "#f3f4f6" },
        },
      },
      grid: {
        right: showEndLabels ? (isMobile ? 120 : 140) : isMobile ? 25 : 30,
        top: isMobile ? 70 : 80,
        bottom: isMobile ? 50 : 60,
        left: isMobile ? 45 : 60,
      },
      series: seriesList,
    }
  } else if (
    seriesField &&
    data.some((item) => item[seriesField as keyof typeof item])
  ) {
    // Traditional multi-line chart
    const series = Array.from(
      new Set(data.map((item) => item[seriesField as keyof typeof item]))
    ).map((seriesName, index) => {
      const seriesData = data
        .filter((item) => item[seriesField as keyof typeof item] === seriesName)
        .map((item) => [
          item[xField as keyof typeof item],
          item[yField as keyof typeof item],
        ])

      return {
        name: seriesName,
        type: "line",
        smooth,
        showSymbol: showSymbol,
        data: seriesData,
        endLabel: showEndLabels
          ? {
              show: true,
              formatter: function (params: any) {
                return `${seriesName}: ${params.value[1]}`
              },
            }
          : undefined,
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: Array.isArray(color)
            ? color[index % color.length]
            : index === 0
              ? "#1890ff"
              : "#52c41a",
        },
        lineStyle: {
          width: 2,
        },
        areaStyle: isArea
          ? {
              color: gradientColors
                ? createGradient(gradientColors, index)
                : Array.isArray(color)
                  ? color[index % color.length]
                  : index === 0
                    ? "#1890ff"
                    : "#52c41a",
              opacity: opacity,
            }
          : undefined,
        symbolSize: 4,
      }
    })

    option = {
      animationDuration: animationDuration,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      brush: enableBrush
        ? {
            toolbox: ["rect", "polygon", "keep", "clear"],
            xAxisIndex: 0,
            brushStyle: {
              borderWidth: 1,
              color: "rgba(120,140,180,0.15)",
              borderColor: "rgba(120,140,180,0.35)",
            },
          }
        : undefined,
      legend: {
        data: series.map((s) => s.name),
        top: isMobile ? 30 : 10,
        orient: "horizontal",
        left: "center",
        textStyle: {
          fontSize: isMobile ? 10 : 12,
        },
        itemWidth: isMobile ? 10 : 18,
        itemHeight: isMobile ? 10 : 14,
        itemGap: isMobile ? 8 : 10,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: Array.from(
          new Set(data.map((item) => item[xField as keyof typeof item]))
        ),
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
          interval: isMobile ? "auto" : 0,
          rotate: isMobile ? 45 : 0,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
        },
        splitLine: {
          lineStyle: { color: "#f3f4f6" },
        },
      },
      grid: {
        right: showEndLabels ? (isMobile ? 120 : 140) : isMobile ? 25 : 30,
        top: isMobile ? 70 : 80,
        bottom: isMobile ? 50 : 60,
        left: isMobile ? 45 : 60,
      },
      series,
    }
  } else {
    // Single line chart
    const chartData = data.map((item) => [
      item[xField as keyof typeof item],
      item[yField as keyof typeof item],
    ])

    option = {
      animationDuration: animationDuration,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      brush: enableBrush
        ? {
            toolbox: ["rect", "polygon", "keep", "clear"],
            xAxisIndex: 0,
            brushStyle: {
              borderWidth: 1,
              color: "rgba(120,140,180,0.15)",
              borderColor: "rgba(120,140,180,0.35)",
            },
          }
        : undefined,
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item[xField as keyof typeof item]),
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
          interval: isMobile ? "auto" : 0,
          rotate: isMobile ? 45 : 0,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: isMobile ? 10 : 12,
        },
        splitLine: {
          lineStyle: { color: "#f3f4f6" },
        },
      },
      grid: {
        right: showEndLabels ? (isMobile ? 120 : 140) : isMobile ? 25 : 30,
        top: isMobile ? 70 : 80,
        bottom: isMobile ? 50 : 60,
        left: isMobile ? 45 : 60,
      },
      series: [
        {
          type: "line",
          smooth,
          showSymbol: showSymbol,
          data: chartData,
          endLabel: showEndLabels
            ? {
                show: true,
                formatter: function (params: any) {
                  return `${params.value[1]}`
                },
              }
            : undefined,
          itemStyle: {
            color: Array.isArray(color) ? color[0] : color,
          },
          lineStyle: {
            width: 2,
            color: Array.isArray(color) ? color[0] : color,
          },
          areaStyle: isArea
            ? {
                color: gradientColors
                  ? createGradient(gradientColors, 0)
                  : Array.isArray(color)
                    ? color[0]
                    : color,
                opacity: opacity,
              }
            : undefined,
          symbolSize: 4,
        },
      ],
    }
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
