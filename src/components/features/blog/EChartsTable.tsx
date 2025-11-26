import React from "react"

interface Column {
  title: string
  dataIndex: string
  key: string
  render?: (value: any, record: any, index: number) => React.ReactNode
}

interface EChartsTableProps {
  columns: Column[]
  dataSource: any[]
  title: string
  pagination?: boolean
  size?: "small" | "middle" | "large"
}

export default function EChartsTable({
  columns,
  dataSource,
  title,
  pagination = false,
  size = "middle",
}: EChartsTableProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-xs px-2 py-2 sm:px-3 sm:py-3"
      case "large":
        return "text-base px-4 py-3 sm:px-6 sm:py-4"
      default:
        return "text-sm px-3 py-3 sm:px-4 sm:py-3"
    }
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <div className="my-6 sm:my-8 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            {title}
          </h3>
        </div>
        <div className="p-8">
          <div className="flex h-32 items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-lg font-medium">No data available</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-6 sm:my-8 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left font-medium text-gray-900 tracking-wider ${getSizeClasses()}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataSource.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`text-gray-900 ${getSizeClasses()}`}
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {pagination && dataSource.length > 10 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-600 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {dataSource.length}
              </span>{" "}
              items
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
