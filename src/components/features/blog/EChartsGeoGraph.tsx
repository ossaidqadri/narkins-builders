import React from "react"
import ChartContainer from "./chart-container"

interface RouteNode {
  name: string
  value: [number, number] // [longitude, latitude]
}

interface RouteEdge {
  source: string
  target: string
}

interface EChartsGeoGraphProps {
  title: string
  mapName: string // e.g., 'pakistan', 'ch', etc.
  mapGeoJSON: any // GeoJSON data for the map
  nodes: RouteNode[]
  edges: RouteEdge[]
  height?: number
  showLabels?: boolean
  lineColor?: string
  aspectScale?: number
}

export default function EChartsGeoGraph({
  title,
  mapName,
  mapGeoJSON,
  nodes,
  edges,
  height = 400,
  showLabels = true,
  lineColor = "#718adbff",
  aspectScale = 0.75,
}: EChartsGeoGraphProps) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      // Register map dynamically
      const echarts = require("echarts")
      echarts.registerMap(mapName, mapGeoJSON)
    }
  }, [isClient, mapName, mapGeoJSON])

  const option = {
    geo: {
      map: mapName,
      roam: true,
      aspectScale: aspectScale,
      label: {
        show: showLabels,
        textBorderColor: "#fff",
        textBorderWidth: 2,
      },
      itemStyle: {
        areaColor: "#f3f4f6",
        borderColor: "#d1d5db",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#e5e7eb",
        },
        label: {
          color: "#111827",
        },
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.componentSubType === "graph") {
          return params.name
        }
        return params.name
      },
    },
    series: [
      {
        type: "graph",
        coordinateSystem: "geo",
        data: nodes,
        edges: edges,
        edgeSymbol: ["none", "arrow"],
        edgeSymbolSize: 5,
        lineStyle: {
          color: lineColor,
          opacity: 1,
          width: 2,
        },
        itemStyle: {
          color: "#5470c6",
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: showLabels,
          position: "right",
          formatter: "{b}",
          fontSize: 12,
          color: "#374151",
        },
        emphasis: {
          itemStyle: {
            color: "#1d4ed8",
            borderColor: "#fff",
            borderWidth: 3,
          },
          lineStyle: {
            width: 3,
          },
        },
      },
    ],
  }

  if (!isClient) {
    return null
  }

  return (
    <ChartContainer
      title={title}
      option={option}
      height={height}
      data={nodes}
    />
  )
}
