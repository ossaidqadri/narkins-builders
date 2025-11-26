import React from "react"
import Image from "next/image"
import FAQ from "@/components/features/faq/faq"
import { ZoomableImage } from "@/components/features/blog/zoomable-image"
import EconomicGauge from "@/components/features/blog/EconomicGauge"
import FDIFlowChart from "@/components/features/blog/FDIFlowChart"
import InvestmentFunnel from "@/components/features/blog/InvestmentFunnel"
import VideoPlayer from "@/components/features/video-player/video-player"
import { getImageAltText } from "@/data/image-alt-texts"
import dynamic from "next/dynamic"
import EChartsLineChart from "@/components/features/blog/EChartsLineChart"
import EChartsColumnChart from "@/components/features/blog/EChartsColumnChart"
import EChartsPieChart from "@/components/features/blog/EChartsPieChart"
import EChartsPolarBarChart from "@/components/features/blog/EChartsPolarBarChart"
import EChartsWaterfallChart from "@/components/features/blog/EChartsWaterfallChart"
import EChartsHeatmapChart from "@/components/features/blog/EChartsHeatmapChart"
import EChartsScatterChart from "@/components/features/blog/EChartsScatterChart"
import EChartsLiquidFillChart from "@/components/features/blog/EChartsLiquidFillChart"
import EChartsPictorialBarChart from "@/components/features/blog/EChartsPictorialBarChart"
import ECharts3DBarChart from "@/components/features/blog/ECharts3DBarChart"
import EChartsCylindricalBarChart from "@/components/features/blog/EChartsCylindricalBarChart"
import EChartsTable from "@/components/features/blog/EChartsTable"
import EChartsProgressBar from "@/components/features/blog/EChartsProgressBar"
import EChartsStatistic from "@/components/features/blog/EChartsStatistic"
import EChartsSunburst from "@/components/features/blog/EChartsSunburst"
import EChartsGeoGraph from "@/components/features/blog/EChartsGeoGraph"
import {
  apartmentSaleFAQs,
  boutiqueResidencyFAQs,
  firstTimeBuyerFAQs,
  generalRealEstateFAQs,
  hillCrestFAQs,
  investmentGuideFAQs,
  luxuryApartmentsFAQs,
  twoBedroomFAQs,
} from "@/data/faq-data"

const ImageCarousel = dynamic(
  () => import("@/components/features/blog/blog-image-carousel")
)

const htmlComponents = {
  // Headers - Large, bold, professional spacing with mobile optimization
  h1: (props: any) => (
    <h1
      className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-6 sm:mb-8 mt-8 sm:mt-12 leading-tight"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 sm:mb-6 mt-8 sm:mt-10 leading-tight"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-lg sm:text-xl lg:text-2xl text-gray-900 mb-3 sm:mb-4 mt-6 sm:mt-8 leading-tight"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className="text-base sm:text-lg lg:text-xl text-gray-800 mb-2 sm:mb-3 mt-4 sm:mt-6 leading-tight"
      {...props}
    />
  ),

  // Paragraphs - Clean spacing with mobile optimization
  p: (props: any) => (
    <p
      className="text-base sm:text-lg text-gray-700 leading-7 sm:leading-8 mb-4 sm:mb-6"
      {...props}
    />
  ),

  // Lists - Professional bullet points and spacing with mobile optimization
  ul: (props: any) => (
    <ul
      className="list-disc list-outside ml-4 sm:ml-6 mb-6 sm:mb-8 space-y-2 sm:space-y-3"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal list-outside ml-4 sm:ml-6 mb-6 sm:mb-8 space-y-2 sm:space-y-3"
      {...props}
    />
  ),
  li: (props: any) => (
    <li
      className="text-base sm:text-lg text-gray-700 leading-7 sm:leading-8 pl-1 sm:pl-2"
      {...props}
    />
  ),

  // Modern responsive table design
  table: (props: any) => (
    <div className="overflow-x-auto my-6 sm:my-8 rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-gray-50 border-b border-gray-200" {...props} />
  ),
  tbody: (props: any) => (
    <tbody className="divide-y divide-gray-200" {...props} />
  ),
  th: (props: any) => (
    <th
      className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-900 tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-900 whitespace-nowrap"
      {...props}
    />
  ),
  tr: (props: any) => (
    <tr className="hover:bg-gray-50 transition-colors" {...props} />
  ),

  // Images - Enhanced with zoom functionality
  img: (props: any) => {
    const filename = props.src?.split("/").pop() || ""
    const altText =
      props.alt ||
      getImageAltText(
        filename,
        `Image: ${props.title || filename.replace(/\.(webp|jpg|jpeg|png)$/, "").replace(/-/g, " ")}`
      )

    return (
      <ZoomableImage
        src={props.src}
        alt={altText}
        width={800}
        height={600}
        className="my-8"
        caption={props.title}
      />
    )
  },

  // Links and emphasis
  a: (props: any) => (
    <a className="text-blue-600 hover:text-blue-800 " {...props} />
  ),
  strong: (props: any) => (
    <span className="font-bold text-gray-900" {...props} />
  ),
  em: (props: any) => <em className="italic text-gray-700" {...props} />,

  // Code and quotes
  code: (props: any) => <code {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 italic text-gray-700"
      {...props}
    />
  ),

  // Dividers
  hr: (props: any) => <hr className="my-8 border-gray-300" {...props} />,

  // Pass through other elements
  ...Object.fromEntries(
    ["div", "details", "summary", "svg", "path", "span"].map((tag) => [
      tag,
      (props: any) => React.createElement(tag, props),
    ])
  ),
}

const customComponents = {
  PropertyCard: ({
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    image,
  }: {
    title: string
    price: string
    location: string
    bedrooms: number
    bathrooms: number
    area: string
    image: string
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden my-8 border border-gray-200">
      <Image
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        width={400}
        height={200}
      />
      <div className="p-6">
        <h3 className=" text-xl mb-3 text-gray-900">{title}</h3>
        <p className="text-3xl text-blue-600 mb-3">{price}</p>
        <p className="text-gray-600 mb-4">{location}</p>
        <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
          <span>{bedrooms} Bedrooms</span>
          <span>{bathrooms} Bathrooms</span>
          <span>{area}</span>
        </div>
      </div>
    </div>
  ),

  MarketTable: ({
    data,
  }: {
    data: Array<{ area: string; avgPrice: string; growth: string }>
  }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full bg-white border-2 border-gray-400 rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm text-blue-800 uppercase tracking-wide border-b border-r border-gray-300">
              Area
            </th>
            <th className="px-6 py-4 text-left text-sm text-blue-800 uppercase tracking-wide border-b border-r border-gray-300">
              Avg Price
            </th>
            <th className="px-6 py-4 text-left text-sm text-blue-800 uppercase tracking-wide border-b">
              YoY Growth
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 border-b border-r border-gray-200">
                {row.area}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 border-b border-r border-gray-200">
                {row.avgPrice}
              </td>
              <td className="px-6 py-4 text-sm text-green-600 border-b">
                {row.growth}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),

  CallToAction: ({
    title,
    description,
    buttonText,
    buttonLink,
  }: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 my-8">
      <h3 className="text-2xl text-blue-900 mb-3">{title}</h3>
      <p className="text-blue-700 mb-6 leading-relaxed">{description}</p>
      <a
        href={buttonLink}
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors "
      >
        {buttonText}
      </a>
    </div>
  ),
  PricingTable: ({
    data,
    title,
  }: {
    data: Array<{
      category: string
      price: number | string
      rent: number | string
      roi: number | string
    }>
    title: string
  }) => {
    // Determine if this is disaster/rainfall data based on title
    const isDisasterData =
      title.toLowerCase().includes("rainfall") ||
      title.toLowerCase().includes("casualties") ||
      title.toLowerCase().includes("clearance")

    // Determine if this is utility cost data based on title
    const isUtilityData =
      title.toLowerCase().includes("utility") ||
      title.toLowerCase().includes("cost comparison")
    const columns = [
      {
        title: isDisasterData
          ? "Area"
          : isUtilityData
            ? "Property Type"
            : "Category",
        dataIndex: "category",
        key: "category",
        render: (text: string) => text,
      },
      {
        title: isDisasterData
          ? "Rainfall (mm)"
          : isUtilityData
            ? "Base Cost (PKR K)"
            : "Price (Lac)",
        dataIndex: "price",
        key: "price",
        render: (value: number | string) => {
          if (isDisasterData) return value
          if (isUtilityData)
            return typeof value === "number" ? `PKR ${value}K` : value
          return typeof value === "number" ? `PKR ${value}` : value
        },
      },
      {
        title: isDisasterData
          ? "Clearance Time"
          : isUtilityData
            ? "Monthly Savings (PKR K)"
            : "Monthly Rent (K)",
        dataIndex: "rent",
        key: "rent",
        render: (value: number | string) => {
          if (isDisasterData) return value
          if (isUtilityData)
            return typeof value === "number" ? `PKR ${value}K` : value
          return typeof value === "number" && value > 0
            ? `PKR ${value}K`
            : "N/A"
        },
      },
      {
        title: isDisasterData
          ? "Casualties/Impact"
          : isUtilityData
            ? "System Type"
            : "ROI %",
        dataIndex: "roi",
        key: "roi",
        render: (value: number | string) => {
          if (isDisasterData) {
            const isGood =
              value.toString().toLowerCase().includes("zero") ||
              value.toString().toLowerCase().includes("none")
            return (
              <span
                className={`font-bold ${isGood ? "text-green-600" : "text-red-600"}`}
              >
                {value}
              </span>
            )
          }
          if (isUtilityData)
            return <span className="text-blue-600 font-medium">{value}</span>
          return <span className="text-green-600 font-bold">{value}%</span>
        },
      },
    ]
    const tableData = data.map((item, index) => ({
      key: index,
      ...item,
    }))
    return (
      <EChartsTable
        columns={columns}
        dataSource={tableData}
        title={title}
        pagination={false}
        size="middle"
      />
    )
  },
  OccupancyGauge: ({ value, title }: { value: number; title: string }) => (
    <EChartsLiquidFillChart
      value={value}
      title={title}
      subtitle="Occupancy Rate"
      color={["#52c41a", "#95de64"]}
      backgroundColor="#f6ffed"
      showWave={true}
      waveAnimation={true}
      animationDuration={4000}
      height={300}
    />
  ),
  SalesTarget: ({ value, title }: { value: number; title: string }) => (
    <EChartsLiquidFillChart
      value={value}
      title={title}
      subtitle="Target Achievement"
      color={["#fa8c16", "#ffc069"]}
      backgroundColor="#fff7e6"
      showWave={true}
      waveAnimation={true}
      animationDuration={4500}
      height={320}
    />
  ),
  EconomicGauge: (props: any) => <EconomicGauge {...props} />,
  FDIFlowChart: (props: any) => <FDIFlowChart {...props} />,
  InvestmentFunnel: (props: any) => <InvestmentFunnel {...props} />,
  VideoPlayer: (props: any) => (
    <div className="-mx-6 lg:-mx-8 my-8">
      <div className="px-4 bg-neutral-50 relative md:xl:px-0 w-full h-auto max-w-7xl z-index-0 bg-transparent mx-auto rounded-xl overflow-hidden md:lg:rounded-none">
        <VideoPlayer {...props} />
      </div>
    </div>
  ),
} // TinaCMS Template Components
const FAQTemplate = (props: any) => {
  const {
    staticFaqs,
    pageUrl,
    contextType = "general",
    title = "Frequently Asked Questions",
    description,
  } = props // FAQ data map using ES6 imports (TinaCMS-compatible)
  const faqDataMap: any = {
    firstTimeBuyerFAQs,
    investmentGuideFAQs,
    twoBedroomFAQs,
    luxuryApartmentsFAQs,
    generalRealEstateFAQs,
    hillCrestFAQs,
    boutiqueResidencyFAQs,
    apartmentSaleFAQs,
  }
  const faqData = staticFaqs ? faqDataMap[staticFaqs] || [] : []
  return (
    <FAQ
      staticFaqs={faqData}
      pageUrl={
        pageUrl || (typeof window !== "undefined" ? window.location.href : "")
      }
      contextType={contextType}
      title={title}
      description={description}
    />
  )
}
const templateComponents = {
  FAQ: FAQTemplate,
  CallToAction: customComponents.CallToAction,
  PropertyCard: customComponents.PropertyCard,
  MarketTable: customComponents.MarketTable,
  PricingTable: customComponents.PricingTable,
  EconomicGauge,
  FDIFlowChart,
  InvestmentFunnel,
  EChartsLineChart,
  EChartsColumnChart,
  EChartsPieChart,
  EChartsPolarBarChart,
  EChartsWaterfallChart,
  EChartsHeatmapChart,
  EChartsScatterChart,
  EChartsLiquidFillChart,
  EChartsPictorialBarChart,
  ECharts3DBarChart,
  EChartsCylindricalBarChart,
  EChartsProgressBar,
  EChartsTable,
  EChartsStatistic,
  EChartsSunburst,
  EChartsGeoGraph,
  ImageGrid: ({
    images,
  }: {
    images: Array<{
      src: string
      alt: string
      title: string
      description: string
    }>
  }) => {
    const isSingleImage = images.length === 1

    return (
      <div
        className={`${isSingleImage ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2"} gap-4 sm:gap-6 my-6 sm:my-8`}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className={`space-y-2 sm:space-y-3 ${isSingleImage ? "w-full max-w-2xl" : ""}`}
          >
            <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className={`w-full ${isSingleImage ? "h-auto" : "h-48 sm:h-56 md:h-64"} object-cover`}
                sizes={
                  isSingleImage
                    ? "100vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                }
              />
            </div>
            <div className="text-center px-2 sm:px-0">
              <h4 className="text-gray-900 font-semibold text-xs sm:text-sm mb-1">
                {img.title}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                {img.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  ImageCarousel,
}

const components = {
  ...htmlComponents,
  ...customComponents,
  ...templateComponents,
}

export default components
