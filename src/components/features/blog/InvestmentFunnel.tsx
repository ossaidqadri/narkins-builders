import React from "react"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
})

interface InvestmentFunnelProps {
  data?: Array<{
    stage: string
    value: number
    percentage?: number
  }>
  title: string
}

export default function InvestmentFunnel({
  data,
  title,
}: InvestmentFunnelProps) {
  // Default data for investment funnel if not provided
  const defaultData = [
    { stage: "Considering Pakistan Investment", value: 12500, percentage: 100 },
    { stage: "Researching Locations", value: 8750, percentage: 70 },
    { stage: "Evaluating Developers", value: 4375, percentage: 35 },
    { stage: "Shortlisting Properties", value: 2500, percentage: 20 },
    { stage: "Chose NBR/HCR", value: 1875, percentage: 15 },
    { stage: "Completed Investment", value: 1500, percentage: 12 },
  ]

  // Safe data validation
  const validateData = (inputData: any): typeof defaultData => {
    if (!Array.isArray(inputData) || inputData.length === 0) return defaultData

    return inputData.map((item) => ({
      stage: item?.stage ? String(item.stage) : "Unknown",
      value:
        typeof item?.value === "number" && !isNaN(item.value)
          ? Math.max(0, item.value)
          : 0,
      percentage:
        typeof item?.percentage === "number" && !isNaN(item.percentage)
          ? Math.max(0, Math.min(100, item.percentage))
          : undefined,
    }))
  }

  const chartData = validateData(data)

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
    title: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const data = params.data
        const percentage = data.percentage ? ` (${data.percentage}%)` : ""
        return `${params.name}: ${data.value.toLocaleString()} investors${percentage}`
      },
    },
    series: [
      {
        name: "Investment Funnel",
        type: "funnel",
        left: "10%",
        top: 60,
        bottom: 60,
        width: "80%",
        min: 0,
        max: 100,
        minSize: "0%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          color: "#fff",
          fontWeight: "bold",
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 14,
          },
        },
        data: chartData.map((item, index) => ({
          value: item.value,
          name: item.stage,
          percentage: item.percentage,
          itemStyle: {
            color:
              index === 0
                ? "#1890ff"
                : index === 1
                  ? "#13c2c2"
                  : index === 2
                    ? "#52c41a"
                    : index === 3
                      ? "#faad14"
                      : index === 4
                        ? "#f759ab"
                        : "#eb2f96",
          },
        })),
      },
    ],
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6 p-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {title || "Investment Funnel"}
        </h3>
      </div>
      <div style={{ height: 400 }}>
        <ReactECharts
          option={option}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Conversion tracking from initial interest to completed investment</p>
      </div>
    </div>
  )
}
