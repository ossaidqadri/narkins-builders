import Link from "next/link"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  currentPage: string
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm"
    >
      {/* Home */}
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center"
        aria-label="Home"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          <Link
            href={item.href}
            className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            {item.label}
          </Link>
        </div>
      ))}

      {/* Current page */}
      <div className="flex items-center space-x-2">
        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900 font-medium line-clamp-1">
          {currentPage}
        </span>
      </div>
    </nav>
  )
}
