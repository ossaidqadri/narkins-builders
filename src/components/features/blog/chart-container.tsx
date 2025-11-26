import React from "react"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
      Loading chart...
    </div>
  ),
})

interface ChartContainerProps {
  title: string
  option: any
  height?: number
  data?: any[]
  noDataMessage?: string
  chartRef?: React.RefObject<any>
}

export default function ChartContainer({
  title,
  option,
  height = 300,
  data,
  noDataMessage = "No data available",
  chartRef,
}: ChartContainerProps) {
  if (data && data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border my-8 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded">
          {noDataMessage}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border my-8 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div style={{ height }}>
        <ReactECharts
          option={option}
          style={{ height: `${height}px`, width: "100%" }}
          {...(chartRef && { ref: chartRef })}
        />
      </div>
    </div>
  )
}
