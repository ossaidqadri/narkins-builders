import React from "react"
import ChartContainer from "./chart-container"

interface EChartsScatterChartProps {
  data: Array<{
    x: number
    y: number
    size?: number
    category?: string
    name?: string
  }>
  title: string
  xAxisLabel?: string
  yAxisLabel?: string
  color?: string | string[]
  height?: number
  enableBrush?: boolean
  enableZoom?: boolean
  showSymbolSize?: boolean
  symbolSizeRange?: [number, number]
  animationDuration?: number
  seriesField?: string
}

export default function EChartsScatterChart({
  data,
  title,
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  color = "#1890ff",
  height = 500,
  enableBrush = true,
  enableZoom = true,
  showSymbolSize = false,
  symbolSizeRange = [10, 40],
  animationDuration = 3000,
  seriesField,
}: EChartsScatterChartProps) {
  // Calculate size range for symbol sizing
  const sizes = data.map((item) => item.size || 1)
  const minSize = Math.min(...sizes)
  const maxSize = Math.max(...sizes)

  // Prepare series data
  let series

  if (
    seriesField &&
    data.some((item) => item[seriesField as keyof typeof item])
  ) {
    // Multi-series scatter
    const categories = [
      ...new Set(data.map((item) => item[seriesField as keyof typeof item])),
    ]

    series = categories.map((category, index) => {
      const categoryData = data
        .filter((item) => item[seriesField as keyof typeof item] === category)
        .map((item) => {
          const symbolSize =
            showSymbolSize && item.size
              ? symbolSizeRange[0] +
                ((item.size - minSize) / (maxSize - minSize)) *
                  (symbolSizeRange[1] - symbolSizeRange[0])
              : 15

          return {
            value: [item.x, item.y, item.size || 0],
            symbolSize: symbolSize,
            name: item.name || `${item.x}, ${item.y}`,
          }
        })

      return {
        name: category,
        type: "scatter",
        data: categoryData,
        itemStyle: {
          color: Array.isArray(color) ? color[index % color.length] : color,
          opacity: 0.8,
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }
    })
  } else {
    // Single series scatter
    const scatterData = data.map((item) => {
      const symbolSize =
        showSymbolSize && item.size
          ? symbolSizeRange[0] +
            ((item.size - minSize) / (maxSize - minSize)) *
              (symbolSizeRange[1] - symbolSizeRange[0])
          : 15

      return {
        value: [item.x, item.y, item.size || 0],
        symbolSize: symbolSize,
        name: item.name || `${item.x}, ${item.y}`,
      }
    })

    series = [
      {
        name: "Data Points",
        type: "scatter",
        data: scatterData,
        itemStyle: {
          color: Array.isArray(color) ? color[0] : color,
          opacity: 0.8,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ]
  }

  const option = {
    animationDuration: animationDuration,
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const point = params.data
        let tooltip = `${params.seriesName}<br/>`
        tooltip += `${xAxisLabel}: ${point.value[0]}<br/>`
        tooltip += `${yAxisLabel}: ${point.value[1]}`
        if (showSymbolSize && point.value[2] !== undefined) {
          tooltip += `<br/>Size: ${point.value[2]}`
        }
        return tooltip
      },
    },
    legend:
      series.length > 1
        ? {
            top: "5%",
            data: series.map((s) => s.name),
          }
        : undefined,
    brush: enableBrush
      ? {
          toolbox: ["rect", "polygon", "lineX", "lineY", "keep", "clear"],
          xAxisIndex: 0,
          yAxisIndex: 0,
          brushStyle: {
            borderWidth: 1,
            color: "rgba(120,140,180,0.15)",
            borderColor: "rgba(120,140,180,0.35)",
          },
        }
      : undefined,
    toolbox: enableZoom
      ? {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
          right: "5%",
          top: "5%",
        }
      : undefined,
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: series.length > 1 ? "15%" : "10%",
    },
    xAxis: {
      type: "value",
      name: xAxisLabel,
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: {
        color: "#374151",
        fontSize: 12,
      },
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
    yAxis: {
      type: "value",
      name: yAxisLabel,
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        color: "#374151",
        fontSize: 12,
      },
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
    dataZoom: enableZoom
      ? [
          {
            type: "inside",
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
          {
            type: "slider",
            xAxisIndex: 0,
            bottom: "5%",
          },
        ]
      : undefined,
    series: series,
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
