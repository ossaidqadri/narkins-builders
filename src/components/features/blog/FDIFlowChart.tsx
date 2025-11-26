import React from "react"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
})

interface FDIFlowChartProps {
  title: string
}

export default function FDIFlowChart({ title }: FDIFlowChartProps) {
  const data = {
    nodes: [
      { name: "Foreign Investment" },
      { name: "Real Estate" },
      { name: "Manufacturing" },
      { name: "Services" },
      { name: "Technology" },
      { name: "Residential" },
      { name: "Commercial" },
      { name: "Bahria Town" },
      { name: "DHA" },
      { name: "Other Areas" },
    ],
    links: [
      { source: "Foreign Investment", target: "Real Estate", value: 2.7 },
      { source: "Foreign Investment", target: "Manufacturing", value: 1.5 },
      { source: "Foreign Investment", target: "Services", value: 0.8 },
      { source: "Foreign Investment", target: "Technology", value: 0.6 },
      { source: "Real Estate", target: "Residential", value: 1.8 },
      { source: "Real Estate", target: "Commercial", value: 0.9 },
      { source: "Residential", target: "Bahria Town", value: 0.9 },
      { source: "Residential", target: "DHA", value: 0.6 },
      { source: "Residential", target: "Other Areas", value: 0.3 },
    ],
  }

  // Add client-side check
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {title || "Loading..."}
          </h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
          Loading chart...
        </div>
      </div>
    )
  }

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "sankey",
        data: data.nodes,
        links: data.links,
        emphasis: {
          focus: "adjacency",
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: "#1890ff",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: "#FAAD14",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
          },
          {
            depth: 2,
            itemStyle: {
              color: "#30BF78",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
          },
        ],
        lineStyle: {
          color: "gradient",
          curveness: 0.5,
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#fff",
        },
        label: {
          color: "rgba(0,0,0,0.7)",
          fontFamily: "Arial",
          fontSize: 12,
        },
      },
    ],
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6 p-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {title || "FDI Flow Chart"}
        </h3>
      </div>
      <div style={{ height: 400 }}>
        <ReactECharts
          option={option}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
            <span className="text-gray-600">Source</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
            <span className="text-gray-600">Sector</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
            <span className="text-gray-600">Target</span>
          </div>
          <div className="text-center">
            <span className="text-gray-600">Real estate leads with $2.7B</span>
          </div>
        </div>
      </div>
    </div>
  )
}
