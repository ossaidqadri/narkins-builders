import React from "react"
import ChartContainer from "./chart-container"

interface EChartsColumnChartProps {
  data: Array<{
    area?: string
    category?: string
    name?: string
    growth?: number
    value?: number
    value1?: number
    value2?: number
    type?: string
    label1?: string
    label2?: string
  }>
  title: string
  xField: string
  yField: string | string[]
  seriesField?: string
  isGroup?: boolean
  color?: string | string[]
  height?: number
  isRacing?: boolean
  raceData?: Array<Array<any>>
  updateInterval?: number
  showValueLabels?: boolean
  isHorizontal?: boolean
  maxItems?: number
  animationDuration?: number
  gradientColors?: string[]
  use3D?: boolean
  showShadows?: boolean
  barBorderRadius?: number
  backgroundStyle?: "gradient" | "pattern" | "solid"
}

export default function EChartsColumnChart({
  data,
  title,
  xField,
  yField,
  seriesField,
  isGroup = false,
  color = "#1890ff",
  height = 300,
  isRacing = false,
  raceData = [],
  updateInterval = 2000,
  showValueLabels = false,
  isHorizontal = false,
  maxItems = 10,
  animationDuration = 1000,
  gradientColors,
  use3D = false,
  showShadows = true,
  barBorderRadius = 8,
  backgroundStyle = "gradient",
}: EChartsColumnChartProps) {
  const [currentFrame, setCurrentFrame] = React.useState(0)
  const chartRef = React.useRef<any>(null)

  // Racing animation effect
  React.useEffect(() => {
    if (!isRacing || !raceData.length || !chartRef.current) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = prev + 1
        if (next >= raceData.length) {
          clearInterval(interval)
          return prev
        }
        return next
      })
    }, updateInterval)

    return () => clearInterval(interval)
  }, [isRacing, raceData.length, updateInterval])

  // Helper function to create advanced gradients
  const createAdvancedGradient = React.useCallback(
    (baseColor: string, index = 0, customGradientColors?: string[]) => {
      if (customGradientColors && customGradientColors.length >= 2) {
        return {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: customGradientColors[0] },
            {
              offset: 0.5,
              color: customGradientColors[1] || customGradientColors[0],
            },
            {
              offset: 1,
              color:
                customGradientColors[2] ||
                customGradientColors[1] ||
                customGradientColors[0],
            },
          ],
        }
      }

      // Auto-generate beautiful gradients
      const colorMap: { [key: string]: string[] } = {
        "#52c41a": ["#52c41a", "#73d13d", "#95de64"], // Green
        "#1890ff": ["#1890ff", "#40a9ff", "#69c0ff"], // Blue
        "#fa8c16": ["#fa8c16", "#ffa940", "#ffc069"], // Orange
        "#722ed1": ["#722ed1", "#9254de", "#b37feb"], // Purple
      }

      const gradientColorsMap = colorMap[baseColor] || [
        "#1890ff",
        "#40a9ff",
        "#69c0ff",
      ]

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
    },
    []
  )

  // Enhanced item style with shadows and effects
  const createEnhancedItemStyle = React.useCallback(
    (baseColor: string, index = 0) => {
      return {
        color: createAdvancedGradient(baseColor, index, gradientColors),
        borderRadius: [barBorderRadius, barBorderRadius, 0, 0],
        shadowBlur: showShadows ? 8 : 0,
        shadowColor: showShadows ? "rgba(0, 0, 0, 0.2)" : "transparent",
        shadowOffsetX: showShadows ? 0 : 0,
        shadowOffsetY: showShadows ? 2 : 0,
        opacity: 0.9,
      }
    },
    [createAdvancedGradient, barBorderRadius, showShadows, gradientColors]
  )

  let option

  // Racing bar chart logic
  if (isRacing && raceData.length > 0) {
    const currentData = raceData[currentFrame] || raceData[0]

    // Sort and limit data for racing effect
    const sortedData = currentData
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxItems)

    const categories = sortedData.map((item) => item[0])
    const values = sortedData.map((item) => item[1])

    option = {
      animationDuration: animationDuration,
      animationDurationUpdate: updateInterval * 0.8,
      animationEasing: "linear",
      animationEasingUpdate: "linear",
      grid: {
        top: 30,
        bottom: 60,
        left: isHorizontal ? 150 : 60,
        right: 80,
      },
      xAxis: isHorizontal
        ? {
            type: "value",
            max: "dataMax",
            axisLabel: {
              color: "#6b7280",
              formatter: function (n: number) {
                return Math.round(n).toString()
              },
            },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
            splitLine: { lineStyle: { color: "#f3f4f6" } },
          }
        : {
            type: "category",
            data: categories,
            axisLabel: {
              color: "#6b7280",
              rotate: categories.length > 6 ? 45 : 0,
            },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
          },
      yAxis: isHorizontal
        ? {
            type: "category",
            data: categories,
            inverse: true,
            axisLabel: {
              show: true,
              color: "#6b7280",
              fontSize: 12,
            },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
            animationDuration: 300,
            animationDurationUpdate: 300,
          }
        : {
            type: "value",
            axisLabel: { color: "#6b7280" },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
            splitLine: { lineStyle: { color: "#f3f4f6" } },
          },
      series: [
        {
          realtimeSort: true,
          type: "bar",
          data: values.map((value, index) => ({
            value: value,
            itemStyle: createEnhancedItemStyle(
              Array.isArray(color) ? color[index % color.length] : color,
              index
            ),
          })),
          label: showValueLabels
            ? {
                show: true,
                precision: 1,
                position: isHorizontal ? "right" : "top",
                valueAnimation: true,
                color: "#374151",
                fontSize: 11,
                fontWeight: "bold",
              }
            : { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params: any) {
          const param = params[0]
          return `${param.name}: ${param.value}`
        },
      },
      graphic:
        currentFrame < raceData.length
          ? {
              elements: [
                {
                  type: "text",
                  right: 160,
                  bottom: 60,
                  style: {
                    text: `Frame ${currentFrame + 1}`,
                    font: "bolder 30px monospace",
                    fill: "rgba(100, 100, 100, 0.25)",
                  },
                  z: 100,
                },
              ],
            }
          : undefined,
    }
  } else if (isGroup && (seriesField || Array.isArray(yField))) {
    // Grouped column chart - support both seriesField and yField array formats
    let series

    if (Array.isArray(yField)) {
      // Handle value1/value2 format
      series = yField.map((field, index) => ({
        name:
          field === "value1"
            ? "Property Price"
            : field === "value2"
              ? "EMI Capacity"
              : field,
        type: "bar",
        data: data.map((item) => item[field as keyof typeof item]),
        itemStyle: createEnhancedItemStyle(
          Array.isArray(color)
            ? color[index % color.length]
            : index === 0
              ? "#1890ff"
              : "#52c41a",
          index
        ),
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      }))
    } else if (seriesField) {
      // Handle seriesField format
      const uniqueSeries = Array.from(
        new Set(data.map((item) => item[seriesField as keyof typeof item]))
      )
      series = uniqueSeries.map((seriesName, index) => {
        const seriesData = data
          .filter(
            (item) => item[seriesField as keyof typeof item] === seriesName
          )
          .map((item) => item[yField as keyof typeof item])

        return {
          name: seriesName,
          type: "bar",
          data: seriesData,
          itemStyle: createEnhancedItemStyle(
            Array.isArray(color)
              ? color[index % color.length]
              : index === 0
                ? "#1890ff"
                : "#52c41a",
            index
          ),
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        }
      })
    }

    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params: any) {
          let result = `<strong>${params[0].axisValue}</strong><br/>`
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value}<br/>`
          })
          return result
        },
      },
      legend: {
        data: series?.map((s) => s.name) || [],
        top: 10,
        textStyle: { color: "#6b7280" },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "20%",
        top: "15%",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item[xField as keyof typeof item]),
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisLabel: {
          color: "#6b7280",
          rotate: data.length > 6 ? 45 : 0,
        },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisLabel: { color: "#6b7280" },
        splitLine: { lineStyle: { color: "#f3f4f6" } },
      },
      series,
      animationDuration,
    }
  } else {
    // Single series column chart - optimized
    const xAxisData = React.useMemo(
      () => data.map((item) => item[xField as keyof typeof item]),
      [data, xField]
    )

    const chartData = React.useMemo(
      () =>
        data.map((item, index) => ({
          name: item[xField as keyof typeof item],
          value: item[yField as keyof typeof item],
          itemStyle: createEnhancedItemStyle(
            Array.isArray(color) ? color[0] : color,
            index
          ),
        })),
      [data, xField, yField, color, createEnhancedItemStyle]
    )

    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params: any) {
          const param = params[0]
          return `<strong>${param.name}</strong><br/>${param.value}`
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: data.length > 4 ? "25%" : "20%",
        top: "15%",
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisLabel: {
          color: "#6b7280",
          rotate: data.length > 6 ? 45 : 0,
          fontSize: 10,
          margin: 15,
          overflow: "break",
          width: data.length > 6 ? 80 : 100,
        },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisLabel: { color: "#6b7280" },
        splitLine: { lineStyle: { color: "#f3f4f6" } },
      },
      series: [
        {
          type: "bar",
          data: chartData,
          label: showValueLabels
            ? {
                show: true,
                position: "top",
                color: "#374151",
                fontSize: 12,
                fontWeight: "bold",
                formatter: "{c}",
              }
            : { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.4)",
              opacity: 1,
            },
          },
        },
      ],
      animationDuration,
    }
  }

  return (
    <ChartContainer
      title={title}
      option={option}
      height={height}
      data={data}
      chartRef={chartRef}
    />
  )
}
