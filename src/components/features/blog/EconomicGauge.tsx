import React from "react"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => <div>Loading gauge...</div>,
})

interface GaugeDataItem {
  value: number
  name: string
  title?: {
    offsetCenter?: [string, string]
    show?: boolean
  }
  detail?: {
    valueAnimation?: boolean
    offsetCenter?: [string, string]
  }
}

interface EconomicGaugeProps {
  value?: number | string
  data?: GaugeDataItem[]
  title: string
  subtitle?: string
}

export default function EconomicGauge({
  value,
  data,
  title,
  subtitle,
}: EconomicGaugeProps) {
  // Safe value parsing with comprehensive validation
  const parseValue = (val: number | string | undefined): number => {
    if (typeof val === "number" && !isNaN(val))
      return Math.max(0, Math.min(100, val))
    if (typeof val === "string") {
      const parsed = parseFloat(val)
      return !isNaN(parsed) ? Math.max(0, Math.min(100, parsed)) : 0
    }
    return 0
  }

  // Support both single value and multi-gauge data
  let gaugeData: GaugeDataItem[]

  if (data) {
    gaugeData = data
  } else if (value !== undefined) {
    // Single value mode - backward compatibility
    const gaugeValue = parseValue(value)
    gaugeData = [
      {
        value: gaugeValue,
        name: "",
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ["0%", "0%"],
        },
      },
    ]
  } else {
    gaugeData = []
  }

  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#464646",
          },
        },
        axisLine: {
          lineStyle: {
            width: 40,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        title: {
          fontSize: 14,
          color: "#374151",
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: "inherit",
          borderColor: "inherit",
          borderRadius: 20,
          borderWidth: 1,
          formatter: "{value}%",
        },
      },
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
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {title || "Loading..."}
          </h3>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          Loading gauge...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6 p-5">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {title || "Economic Gauge"}
        </h3>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div style={{ height: 300 }}>
        <ReactECharts
          option={option}
          style={{ height: "300px", width: "100%" }}
        />
      </div>
    </div>
  )
}
