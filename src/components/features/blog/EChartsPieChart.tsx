import React from "react"
import ChartContainer from "./chart-container"

interface EChartsPieChartProps {
  data: Array<{
    type?: string
    name?: string
    value: number
    color?: string
  }>
  title: string
  height?: number
  showLegend?: boolean
  showLabel?: boolean
}

export default function EChartsPieChart({
  data,
  title,
  height = 300,
  showLegend = true,
  showLabel = true,
}: EChartsPieChartProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Default colors if not provided
  const defaultColors = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#f759ab",
    "#13c2c2",
    "#eb2f96",
    "#722ed1",
    "#fa8c16",
  ]

  const chartData = data.map((item, index) => ({
    name: item.type || item.name || `Item ${index + 1}`,
    value: item.value,
    itemStyle: {
      color: item.color || defaultColors[index % defaultColors.length],
    },
  }))

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: showLegend
      ? {
          orient: isMobile ? "vertical" : "horizontal",
          top: "bottom",
          left: "center",
          data: chartData.map((item) => item.name),
          textStyle: {
            color: "#6b7280",
            fontSize: isMobile ? 10 : 12,
          },
          itemWidth: isMobile ? 10 : 14,
          itemHeight: isMobile ? 10 : 14,
          itemGap: isMobile ? 6 : 10,
          padding: isMobile ? [10, 5, 5, 5] : [15, 5, 5, 5],
          pageButtonItemGap: 5,
          pageButtonGap: 2,
          pageIconSize: 10,
        }
      : undefined,
    series: [
      {
        name: title,
        type: "pie",
        radius: isMobile ? ["25%", "55%"] : ["40%", "70%"],
        center: isMobile ? ["50%", "35%"] : ["50%", "45%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: isMobile ? 6 : 10,
          borderColor: "#fff",
          borderWidth: isMobile ? 1 : 2,
        },
        label: showLabel
          ? {
              show: !isMobile,
              position: "outside",
              formatter: "{b}: {d}%",
              color: "#6b7280",
              fontSize: 11,
              distanceToLabelLine: 5,
            }
          : {
              show: false,
            },
        emphasis: {
          label: {
            show: true,
            fontSize: isMobile ? 11 : 14,
            fontWeight: "bold",
            formatter: isMobile ? "{d}%" : "{b}: {d}%",
            position: isMobile ? "inside" : "outside",
            color: isMobile ? "#fff" : "#6b7280",
          },
          itemStyle: {
            shadowBlur: isMobile ? 5 : 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine:
          showLabel && !isMobile
            ? {
                show: true,
                length: 10,
                length2: 8,
                smooth: true,
              }
            : {
                show: false,
              },
        data: chartData,
      },
    ],
  }

  // If there's too much data, show as progress bars instead
  if (data.length > 8) {
    const progressContent = (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-900 font-medium">
              {item.type || item.name || `Item ${index + 1}`}
            </span>
            <div className="flex items-center space-x-3 w-3/5">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor:
                      item.color || defaultColors[index % defaultColors.length],
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 min-w-[40px] font-medium">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    )

    return (
      <div className="bg-white rounded-lg shadow-sm border my-8 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        {progressContent}
      </div>
    )
  }

  return (
    <ChartContainer title={title} option={option} height={height} data={data} />
  )
}
